import { NextResponse } from "next/server";
import { hasSupabase, sb } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  if (!hasSupabase) {
    return NextResponse.json(
      { error: "The contact form isn't connected yet — please message us on WhatsApp." },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const message = String(body.message || "").trim();
  if (!name || !EMAIL_RE.test(email) || message.length < 3) {
    return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
  }

  try {
    await sb("contact_messages", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        name: name.slice(0, 200),
        email,
        phone: String(body.phone || "").slice(0, 40) || null,
        topic: String(body.topic || "").slice(0, 100) || null,
        message: message.slice(0, 5000),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't send your message. Please try WhatsApp." }, { status: 500 });
  }
}
