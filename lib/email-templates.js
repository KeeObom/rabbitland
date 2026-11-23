// Customer email designs. The same HTML is used in two ways:
//  1. Pasted into Resend → Templates (see /emails/*.html and the README), so
//     you can restyle the emails in Resend's editor without touching code.
//  2. As the built-in fallback, if no Resend template is set or it fails.
//
// Variables use Resend's {{{VARIABLE}}} syntax. Variables ending in _HTML
// contain ready-made HTML (item rows, line breaks). All others are plain text.
//
// Keep this file free of imports: scripts/export-email-templates.mjs reads it.

const C = {
  forest: "#1B3B1F",
  gold: "#C79A3D",
  goldDark: "#9C7A2E",
  cream: "#F5EFE1",
  charcoal: "#2B2620",
  muted: "#6B655C",
  line: "#E4DCC8",
};

const SITE = "https://rabbitlandfarms.com";

function layout({ preheader, badge, heading, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr><td style="background:${C.forest};padding:28px 32px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${C.cream};">Rabbit Land</div>
        <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};margin-top:2px;">Agribusiness · Port Harcourt</div>
      </td></tr>
      <tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${C.charcoal};">
        <div style="display:inline-block;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.goldDark};border:1px solid ${C.gold};border-radius:999px;padding:4px 12px;">${badge}</div>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;color:${C.forest};margin:16px 0 12px;">${heading}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:20px 32px;background:${C.cream};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};">
        Questions? Just reply to this email or chat with us on WhatsApp from <a href="${SITE}" style="color:${C.forest};">rabbitlandfarms.com</a>.<br>
        Rabbit Land Agribusiness · Port Harcourt, Rivers State · Delivering nationwide
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// mono: show the value in the typewriter font (used for money)
const row = (label, value, { strong = false, mono = true } = {}) => `
<tr>
  <td style="padding:6px 0;color:${C.muted};">${label}</td>
  <td align="right" style="padding:6px 0;${mono ? "font-family:'Courier New',monospace;" : ""}${strong ? `font-size:17px;font-weight:bold;color:${C.forest};` : ""}">${value}</td>
</tr>`;

export const orderTemplate = {
  alias: "order-confirmation",
  subject: "Your Rabbit Land order is confirmed ({{{ORDER_REF}}})",
  variables: [
    "CUSTOMER_NAME", "ORDER_REF", "ITEMS_HTML", "SUBTOTAL", "DELIVERY_LABEL",
    "DELIVERY_FEE", "TOTAL", "DELIVERY_DETAILS_HTML", "NEXT_STEP",
  ],
  html: layout({
    preheader: "Payment received. Here's your order summary.",
    badge: "Payment received",
    heading: "Thank you, {{{CUSTOMER_NAME}}}!",
    body: `
<p style="margin:0 0 20px;">Your order is confirmed. {{{NEXT_STEP}}}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};margin-bottom:8px;">
  {{{ITEMS_HTML}}}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
  ${row("Subtotal", "{{{SUBTOTAL}}}")}
  ${row("{{{DELIVERY_LABEL}}}", "{{{DELIVERY_FEE}}}")}
  <tr><td colspan="2" style="border-top:1px solid ${C.line};padding-top:4px;"></td></tr>
  ${row("Total paid", "{{{TOTAL}}}", { strong: true })}
</table>
<div style="margin-top:24px;padding:16px;background:${C.cream};border-radius:10px;font-size:14px;">
  <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.goldDark};margin-bottom:6px;">Delivery</div>
  {{{DELIVERY_DETAILS_HTML}}}
</div>
<p style="margin:20px 0 0;font-size:13px;color:${C.muted};">Order reference: <span style="font-family:'Courier New',monospace;">{{{ORDER_REF}}}</span></p>`,
  }),
};

export const trainingTemplate = {
  alias: "training-confirmation",
  subject: "You're registered: {{{SESSION_TITLE}}}",
  variables: [
    "CUSTOMER_NAME", "REFERENCE", "SESSION_TITLE", "SESSION_DATE",
    "SESSION_DURATION", "PLATFORM", "AMOUNT",
  ],
  html: layout({
    preheader: "Your seat is booked. The joining link will follow before the class.",
    badge: "Registration confirmed",
    heading: "You're in, {{{CUSTOMER_NAME}}}!",
    body: `
<p style="margin:0 0 20px;">Your seat for <strong>{{{SESSION_TITLE}}}</strong> is booked and your payment has been received.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};">
  ${row("Date & time", "{{{SESSION_DATE}}}", { mono: false })}
  ${row("Duration", "{{{SESSION_DURATION}}}", { mono: false })}
  ${row("Where", "Online · {{{PLATFORM}}}", { mono: false })}
  ${row("Fee paid", "{{{AMOUNT}}}", { strong: true })}
</table>
<div style="margin-top:24px;padding:16px;background:${C.cream};border-radius:10px;font-size:14px;">
  <strong>What happens next</strong><br>
  We'll send the {{{PLATFORM}}} joining link to this email and to your WhatsApp before the class starts.
  All you need is a phone or laptop with data. Questions are welcome throughout.
</div>
<p style="margin:20px 0 0;font-size:13px;color:${C.muted};">Reference: <span style="font-family:'Courier New',monospace;">{{{REFERENCE}}}</span></p>`,
  }),
};

/** Fill {{{VARIABLE}}} placeholders (used for the built-in fallback). */
export function renderTemplate(text, variables) {
  return text.replace(/\{\{\{\s*([A-Z0-9_]+)\s*\}\}\}/g, (_, key) =>
    variables[key] !== undefined ? String(variables[key]) : ""
  );
}
