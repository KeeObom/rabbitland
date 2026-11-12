"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/config";

const inputCls = "w-full border border-forest/20 rounded px-3 py-2 bg-white";
const labelCls = "text-sm font-mono text-charcoal/70 block mb-1";
const empty = { name: "", email: "", phone: "", topic: "Buying rabbits", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setForm(empty);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="container-page py-16 grid md:grid-cols-2 gap-14">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">Get in touch</span>
        <h1 className="font-display text-4xl text-forest-dark mt-2 mb-6">Contact us</h1>
        <p className="text-charcoal/75 leading-relaxed mb-8 max-w-md">
          Buying rabbits, bulk orders, training, consultancy or general
          questions — send a message and we'll reply directly. For the
          fastest response, chat with us on WhatsApp.
        </p>

        <ul className="space-y-4 text-sm">
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Location</span>
            {site.locationLabel}
            <span className="block text-charcoal/60">Pickup in Port Harcourt · delivery nationwide</span>
          </li>
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Email</span>
            <a href={`mailto:${site.email}`} className="hover:text-gold-dark">{site.email}</a>
          </li>
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">Phone / WhatsApp</span>
            <a href={site.phoneHref} className="hover:text-gold-dark">{site.phoneDisplay}</a>
          </li>
        </ul>

        <a
          href={whatsappLink("Hello Rabbit Land!")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-[#25D366] text-white font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:opacity-90"
        >
          Chat on WhatsApp
        </a>
      </div>

      {status === "sent" ? (
        <div className="border border-forest/15 rounded-xl p-8 bg-white/60 h-fit">
          <h2 className="font-display text-2xl text-forest-dark mb-2">Message sent</h2>
          <p className="text-charcoal/70 mb-6">Thanks — we'll get back to you shortly.</p>
          <button onClick={() => setStatus("idle")} className="text-sm underline underline-offset-4">
            Send another message
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelCls} htmlFor="c-name">Name</label>
            <input id="c-name" required value={form.name} onChange={update("name")} className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="c-email">Email</label>
              <input id="c-email" type="email" required value={form.email} onChange={update("email")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="c-phone">Phone (optional)</label>
              <input id="c-phone" type="tel" value={form.phone} onChange={update("phone")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="c-topic">What can we help with?</label>
            <select id="c-topic" value={form.topic} onChange={update("topic")} className={inputCls}>
              <option>Buying rabbits</option>
              <option>Bulk / wholesale order</option>
              <option>Online training</option>
              <option>Consultancy booking</option>
              <option>An existing order</option>
              <option>General question</option>
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="c-message">Message</label>
            <textarea id="c-message" rows={5} required value={form.message} onChange={update("message")} className={inputCls} />
          </div>
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3" role="alert">{error}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
