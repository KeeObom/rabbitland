// Confirmation emails to CUSTOMERS after a successful payment (server-only).
//
// They are only sent when EMAIL_FROM is set, i.e. once your own domain is
// verified in Resend (without a verified domain Resend only allows sending to
// your own address).
//
// If RESEND_TEMPLATE_ORDER / RESEND_TEMPLATE_TRAINING are set, the email uses
// that Resend template (so you can edit the design in Resend's dashboard).
// Otherwise, or if the template send fails, the built-in design is used.

import { formatNaira, formatDateTime } from "@/lib/format";
import { deliveryOptions } from "@/lib/config";
import { orderTemplate, trainingTemplate, renderTemplate } from "@/lib/email-templates";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
// Where customer replies go. orders@ has no inbox yet, so default to you.
const REPLY_TO = process.env.EMAIL_REPLY_TO || process.env.OWNER_EMAIL;

const enabled = () => Boolean(RESEND_API_KEY && EMAIL_FROM);

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function resendSend(payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: EMAIL_FROM,
      ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
      ...payload,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function send({ to, template, templateId, variables }) {
  if (!enabled()) return "skipped";
  const subject = renderTemplate(template.subject, variables);

  if (templateId) {
    try {
      await resendSend({ to, subject, template: { id: templateId, variables } });
      return "sent-template";
    } catch (err) {
      console.error(`Resend template "${templateId}" failed, using built-in email instead:`, err);
    }
  }
  await resendSend({ to, subject, html: renderTemplate(template.html, variables) });
  return "sent-builtin";
}

export async function sendOrderConfirmation(o) {
  const delivery = deliveryOptions.find((d) => d.id === o.delivery_method);
  const isPickup = o.delivery_method === "pickup";
  const first = esc(o.customer_name.split(" ")[0]);

  const itemsHtml = o.items
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #E4DCC8;">${esc(i.quantity)} × ${esc(i.name)}</td>
  <td align="right" style="padding:10px 0;border-bottom:1px solid #E4DCC8;font-family:'Courier New',monospace;">${esc(formatNaira(i.price * i.quantity))}</td>
</tr>`
    )
    .join("");

  const deliveryHtml = isPickup
    ? `${esc(delivery?.label || "Pickup")}<br>We'll contact you on ${esc(o.customer_phone)} with directions and a pickup time.`
    : `${esc(delivery?.label || "Delivery")}<br>${esc(o.delivery_address)}, ${esc(o.delivery_state)}<br>We'll call ${esc(o.customer_phone)} to arrange delivery.`;

  return send({
    to: o.customer_email,
    template: orderTemplate,
    templateId: process.env.RESEND_TEMPLATE_ORDER,
    variables: {
      CUSTOMER_NAME: first,
      ORDER_REF: esc(o.reference),
      ITEMS_HTML: itemsHtml,
      SUBTOTAL: formatNaira(o.subtotal),
      DELIVERY_LABEL: esc(delivery?.label || "Delivery"),
      DELIVERY_FEE: o.delivery_fee ? formatNaira(o.delivery_fee) : "Free",
      TOTAL: formatNaira(o.total),
      DELIVERY_DETAILS_HTML: deliveryHtml,
      NEXT_STEP: isPickup
        ? "We'll be in touch shortly to arrange your pickup in Port Harcourt."
        : "We'll be in touch shortly to arrange delivery.",
    },
  });
}

export async function sendTrainingConfirmation(r, session) {
  return send({
    to: r.email,
    template: trainingTemplate,
    templateId: process.env.RESEND_TEMPLATE_TRAINING,
    variables: {
      CUSTOMER_NAME: esc(r.full_name.split(" ")[0]),
      REFERENCE: esc(r.reference),
      SESSION_TITLE: esc(session?.title || "Online training"),
      SESSION_DATE: formatDateTime(session?.starts_at),
      SESSION_DURATION: esc(session?.duration_label || "See class details"),
      PLATFORM: esc(session?.platform || "Zoom"),
      AMOUNT: formatNaira(r.amount),
    },
  });
}
