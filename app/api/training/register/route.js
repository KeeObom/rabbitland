import { NextResponse } from "next/server";
import { hasSupabase, sb } from "@/lib/supabase";
import { hasPaystack, initializePayment, makeReference } from "@/lib/paystack";
import { getTrainingSessionBySlug } from "@/lib/catalog";
import { TRAINING_PREFIX } from "@/lib/fulfil";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  if (!hasSupabase || !hasPaystack) {
    return bad("Online registration isn't switched on yet. Please register through WhatsApp for now.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  if (!name || !EMAIL_RE.test(email) || phone.length < 7) {
    return bad("Please enter your name, a valid email and a phone number.");
  }

  const session = await getTrainingSessionBySlug(String(body.sessionSlug || ""), { fresh: true });
  if (!session) return bad("This training session is no longer available.");
  if (session.seatsTaken >= session.capacity) return bad("Sorry — this session is fully booked.");
  if (session.startsAt && new Date(session.startsAt) < new Date()) {
    return bad("Registration for this session has closed.");
  }

  const reference = makeReference(TRAINING_PREFIX);

  try {
    await sb("training_registrations", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        reference,
        session_id: session.id,
        full_name: name,
        email,
        phone,
        location: String(body.location || "").slice(0, 200) || null,
        experience: String(body.experience || "").slice(0, 200) || null,
        amount: session.price,
      },
    });

    const payment = await initializePayment({
      email,
      amountNaira: session.price,
      reference,
      metadata: { type: "training", session: session.title, customer_name: name, phone },
    });

    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference });
  } catch (err) {
    console.error(err);
    return bad("We couldn't start the payment. Please try again or register on WhatsApp.", 500);
  }
}
