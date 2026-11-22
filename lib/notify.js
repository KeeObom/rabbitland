// Sends new-order / new-registration / new-message alerts to the business
// owner by email (Resend) and/or WhatsApp (CallMeBot). Each channel is
// optional — it switches on when its environment variables are set.
// Server-only.

import { formatNaira, formatDateTime } from "@/lib/format";
import { deliveryOptions, siteName } from "@/lib/config";
import { siteUrl } from "@/lib/paystack";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OWNER_EMAIL = process.env.OWNER_EMAIL;
// Until you verify your own domain in Resend, emails must come from
// onboarding@resend.dev and can only go to your Resend account's email.
const EMAIL_FROM = process.env.EMAIL_FROM || `${siteName} <onboarding@resend.dev>`;

const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE; // e.g. +2347014657933
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY;


function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail({ subject, lines }) {
  if (!RESEND_API_KEY || !OWNER_EMAIL) return "skipped";
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B2620">
    <h2 style="color:#1B3B1F;margin:0 0 12px">${escapeHtml(subject)}</h2>
    ${lines.map((l) => (l === "" ? "<br>" : `<div>${escapeHtml(l)}</div>`)).join("")}
  </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: OWNER_EMAIL.split(",").map((e) => e.trim()),
      subject,
      html,
      text: lines.join("\n"),
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return "sent";
}

async function sendWhatsApp({ subject, lines }) {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_APIKEY) return "skipped";
  const text = [`*${subject}*`, ...lines].join("\n");
  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(CALLMEBOT_PHONE)}` +
    `&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}` +
    `&text=${encodeURIComponent(text)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CallMeBot ${res.status}: ${await res.text()}`);
  return "sent";
}

/** Send to every configured channel; one failing never blocks the other. */
export async function notifyOwner(message) {
  const results = await Promise.allSettled([sendEmail(message), sendWhatsApp(message)]);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`Owner ${i === 0 ? "email" : "WhatsApp"} notification failed:`, r.reason);
    }
  });
  return results;
}

// ── Message builders ──────────────────────────────────────────
// null lines are dropped; "" lines are kept as blank spacers.
const compact = (lines) => lines.filter((l) => l !== null && l !== undefined);

export function orderNotification(o) {
  const delivery = deliveryOptions.find((d) => d.id === o.delivery_method);
  const lines = [
    `Ref: ${o.reference}`,
    `Paid: ${formatNaira(o.total)}`,
    "",
    "Items:",
    ...o.items.map((i) => `• ${i.quantity} × ${i.name} — ${formatNaira(i.price * i.quantity)}`),
    `${delivery?.label || o.delivery_method}: ${o.delivery_fee ? formatNaira(o.delivery_fee) : "Free"}`,
    "",
    `Customer: ${o.customer_name}`,
    `Phone: ${o.customer_phone}`,
    `Email: ${o.customer_email}`,
  ];
  if (o.delivery_address) lines.push(`Address: ${o.delivery_address}, ${o.delivery_state}`);
  if (o.notes) lines.push(`Notes: ${o.notes}`);
  lines.push("", `WhatsApp the customer: https://wa.me/${toWaNumber(o.customer_phone)}`);
  return { subject: `🐇 New paid order — ${formatNaira(o.total)}`, lines };
}

export function registrationNotification(r, session) {
  return {
    subject: `🎓 New training registration — ${session?.title || "Online training"}`,
    lines: compact([
      `Ref: ${r.reference}`,
      `Paid: ${formatNaira(r.amount)}`,
      `Session: ${session?.title || r.session_id}`,
      session?.starts_at ? `Starts: ${formatDateTime(session.starts_at)}` : null,
      "",
      `Name: ${r.full_name}`,
      `Phone: ${r.phone}`,
      `Email: ${r.email}`,
      r.location ? `Location: ${r.location}` : null,
      r.experience ? `Experience: ${r.experience}` : null,
      "",
      `WhatsApp them: https://wa.me/${toWaNumber(r.phone)}`,
    ]),
  };
}

export function contactNotification(m) {
  return {
    subject: `✉️ New website message — ${m.topic || "General"}`,
    lines: compact([
      `From: ${m.name}`,
      `Email: ${m.email}`,
      m.phone ? `Phone: ${m.phone}` : null,
      "",
      m.message,
      "",
      `Sent from ${siteUrl()}/contact`,
    ]),
  };
}

// 08031234567 → 2348031234567 so the wa.me link works
function toWaNumber(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
}
