// Paystack calls this URL after a payment, even if the customer closes the
// browser before returning to the site. Set it in Paystack Dashboard →
// Settings → API Keys & Webhooks → Webhook URL:
//   https://YOUR-DOMAIN/api/paystack/webhook

import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { confirmPayment } from "@/lib/fulfil";

export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    try {
      await confirmPayment(event.data.reference);
    } catch (err) {
      console.error("Webhook fulfilment failed:", err);
      // 500 makes Paystack retry later
      return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
