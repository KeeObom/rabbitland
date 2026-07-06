"use client";

export default function ContactPage() {
  return (
    <div className="container-page py-16 grid md:grid-cols-2 gap-14">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
          Get in touch
        </span>
        <h1 className="font-display text-4xl text-forest-dark mt-2 mb-6">Contact us</h1>
        <p className="text-charcoal/75 leading-relaxed mb-8 max-w-md">
          Bulk orders, wholesale pricing, consultancy bookings or general
          questions — send a message and we'll reply directly.
        </p>

        <ul className="space-y-4 text-sm">
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">
              Location
            </span>
            Warri, Delta State, Nigeria
          </li>
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">
              Email
            </span>
            <a href="mailto:hello@rabbitland.ng" className="hover:text-gold-dark">
              hello@rabbitland.ng
            </a>
          </li>
          <li>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark block mb-1">
              Phone / WhatsApp
            </span>
            <a href="tel:+2340000000000" className="hover:text-gold-dark">
              +234 000 000 0000
            </a>
          </li>
        </ul>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert("This form isn't connected to an inbox yet — wire it up to email or a form service when ready.");
        }}
      >
        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">Name</label>
          <input type="text" required className="w-full border border-forest/20 rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">Email</label>
          <input type="email" required className="w-full border border-forest/20 rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">What can we help with?</label>
          <select className="w-full border border-forest/20 rounded px-3 py-2 bg-white">
            <option>Bulk / wholesale order</option>
            <option>Consultancy booking</option>
            <option>General question</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">Message</label>
          <textarea rows={5} required className="w-full border border-forest/20 rounded px-3 py-2" />
        </div>
        <button
          type="submit"
          className="mt-2 bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
