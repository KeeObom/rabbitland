"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/config";

const inputCls = "w-full border border-forest/20 rounded px-3 py-2 bg-white";
const labelCls = "text-sm font-mono text-charcoal/70 block mb-1";

export default function TrainingRegisterForm({ sessionSlug, sessionTitle, closed }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", experience: "Just starting out" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/training/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sessionSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const waLink = whatsappLink(`Hello Rabbit Land! I'd like to ask about the "${sessionTitle}" online training.`);

  if (closed) {
    return (
      <div className="text-sm text-charcoal/75">
        <p className="mb-4">Registration for this session is closed.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Ask about the next one on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelCls} htmlFor="t-name">Full name</label>
        <input id="t-name" required value={form.name} onChange={update("name")} className={inputCls} autoComplete="name" />
      </div>
      <div>
        <label className={labelCls} htmlFor="t-email">Email</label>
        <input id="t-email" type="email" required value={form.email} onChange={update("email")} className={inputCls} autoComplete="email" />
      </div>
      <div>
        <label className={labelCls} htmlFor="t-phone">Phone / WhatsApp</label>
        <input id="t-phone" type="tel" required value={form.phone} onChange={update("phone")} className={inputCls} autoComplete="tel" />
      </div>
      <div>
        <label className={labelCls} htmlFor="t-location">City / State</label>
        <input id="t-location" value={form.location} onChange={update("location")} className={inputCls} placeholder="e.g. Port Harcourt, Rivers" />
      </div>
      <div>
        <label className={labelCls} htmlFor="t-exp">Your experience</label>
        <select id="t-exp" value={form.experience} onChange={update("experience")} className={inputCls}>
          <option>Just starting out</option>
          <option>Have a few rabbits</option>
          <option>Running a commercial farm</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors disabled:opacity-60"
      >
        {submitting ? "Opening Paystack…" : "Register & pay"}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-center text-sm underline underline-offset-4 text-forest-dark hover:text-gold-dark">
        Questions first? Chat on WhatsApp
      </a>
    </form>
  );
}
