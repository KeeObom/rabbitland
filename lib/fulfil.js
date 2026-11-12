// Confirms a payment with Paystack and marks the matching order or training
// registration as paid. Safe to call more than once for the same reference
// (from both the redirect page and the webhook) — the database functions
// only act on records that are still pending.

import { sb } from "@/lib/supabase";
import { verifyPayment } from "@/lib/paystack";

export const ORDER_PREFIX = "RL";
export const TRAINING_PREFIX = "RLT";

export function referenceKind(reference) {
  if (String(reference).startsWith(`${TRAINING_PREFIX}-`)) return "training";
  if (String(reference).startsWith(`${ORDER_PREFIX}-`)) return "order";
  return null;
}

/**
 * @returns {Promise<{ ok: boolean, kind: "order"|"training"|null, record?: object, reason?: string }>}
 */
export async function confirmPayment(reference) {
  const kind = referenceKind(reference);
  if (!kind) return { ok: false, kind, reason: "Unknown reference" };

  const tx = await verifyPayment(reference);
  if (!tx) return { ok: false, kind, reason: "Could not verify payment with Paystack" };
  if (tx.status !== "success") return { ok: false, kind, reason: `Payment ${tx.status}` };

  const fn = kind === "order" ? "fulfil_order" : "fulfil_registration";
  // Marks as paid (and adjusts stock / seats) only if still pending and the
  // amount paid matches what we expected. Returns true if anything changed.
  await sb(`rpc/${fn}`, {
    method: "POST",
    body: { p_reference: reference, p_amount_kobo: tx.amount },
  });

  const table = kind === "order" ? "orders" : "training_registrations";
  const rows = await sb(
    `${table}?select=*&reference=eq.${encodeURIComponent(reference)}&limit=1`
  );
  const record = rows[0];
  if (!record) return { ok: false, kind, reason: "Record not found" };
  if (record.status !== "paid") {
    return { ok: false, kind, record, reason: "Amount paid did not match the order total" };
  }
  return { ok: true, kind, record };
}
