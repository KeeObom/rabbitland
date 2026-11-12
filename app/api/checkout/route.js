import { NextResponse } from "next/server";
import { hasSupabase, sb } from "@/lib/supabase";
import { hasPaystack, initializePayment, makeReference } from "@/lib/paystack";
import { getProductsForCheckout } from "@/lib/catalog";
import { deliveryOptions } from "@/lib/config";
import { ORDER_PREFIX } from "@/lib/fulfil";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  if (!hasSupabase || !hasPaystack) {
    return bad(
      "Online payment isn't switched on yet. Please order through WhatsApp for now.",
      503
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }

  const { items, customer = {}, delivery = {} } = body;

  // ── Validate customer + delivery ──
  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim().toLowerCase();
  const phone = String(customer.phone || "").trim();
  if (!name || !EMAIL_RE.test(email) || phone.length < 7) {
    return bad("Please enter your name, a valid email and a phone number.");
  }

  const option = deliveryOptions.find((d) => d.id === delivery.method);
  if (!option) return bad("Please choose pickup or a delivery option.");
  const state = String(delivery.state || "").trim();
  const address = String(delivery.address || "").trim();
  if (option.needsAddress && (!state || address.length < 5)) {
    return bad("Please enter your state and delivery address.");
  }

  // ── Validate items against the live catalogue (never trust client prices) ──
  if (!Array.isArray(items) || items.length === 0) return bad("Your cart is empty.");
  const wanted = new Map();
  for (const i of items) {
    const qty = Math.floor(Number(i.quantity));
    if (!/^[a-z0-9-]{1,80}$/.test(String(i.slug)) || !Number.isFinite(qty) || qty < 1 || qty > 1000) {
      return bad("One of the items in your cart is invalid.");
    }
    wanted.set(i.slug, (wanted.get(i.slug) || 0) + qty);
  }

  const products = await getProductsForCheckout([...wanted.keys()]);
  const lineItems = [];
  for (const [slug, quantity] of wanted) {
    const p = products.find((x) => x.slug === slug);
    if (!p) return bad("An item in your cart is no longer available. Please refresh your cart.");
    if (p.stock !== null && p.stock !== undefined && quantity > p.stock) {
      return bad(
        p.stock === 0
          ? `${p.name} has just sold out.`
          : `Only ${p.stock} of ${p.name} left — please reduce the quantity.`
      );
    }
    lineItems.push({ slug, name: p.name, price: p.price, unit: p.unit, quantity });
  }

  const subtotal = lineItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = option.fee;
  const total = subtotal + deliveryFee;
  const reference = makeReference(ORDER_PREFIX);

  try {
    await sb("orders", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        reference,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_method: option.id,
        delivery_state: option.needsAddress ? state : "Rivers",
        delivery_address: option.needsAddress ? address : null,
        notes: String(customer.notes || "").slice(0, 1000) || null,
        items: lineItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
      },
    });

    const payment = await initializePayment({
      email,
      amountNaira: total,
      reference,
      metadata: { type: "order", customer_name: name, phone },
    });

    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference });
  } catch (err) {
    console.error(err);
    return bad("We couldn't start the payment. Please try again or order on WhatsApp.", 500);
  }
}
