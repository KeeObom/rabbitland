// Paystack helpers (server-only). Uses PAYSTACK_SECRET_KEY.
import crypto from "crypto";

const SECRET = process.env.PAYSTACK_SECRET_KEY;
export const hasPaystack = Boolean(SECRET);

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function makeReference(prefix) {
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

/** Start a Paystack transaction. amountNaira is converted to kobo. */
export async function initializePayment({ email, amountNaira, reference, metadata }) {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNaira * 100),
      currency: "NGN",
      reference,
      callback_url: `${siteUrl()}/checkout/verify`,
      metadata,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(`Paystack initialize failed: ${json.message || res.status}`);
  }
  return json.data; // { authorization_url, access_code, reference }
}

/** Ask Paystack for the true status of a transaction. */
export async function verifyPayment(reference) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${SECRET}` }, cache: "no-store" }
  );
  const json = await res.json();
  if (!res.ok || !json.status) return null;
  return json.data; // { status, amount, reference, ... }
}

/** Check that a webhook really came from Paystack. */
export function isValidWebhookSignature(rawBody, signature) {
  if (!SECRET || !signature) return false;
  const hash = crypto.createHmac("sha512", SECRET).update(rawBody).digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
