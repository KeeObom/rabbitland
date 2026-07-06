"use client";

import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display text-4xl text-forest-dark mb-2">Account</h1>
      <p className="text-charcoal/70 mb-8 text-sm">
        Account creation and login are being wired up to a real backend next.
        This is the interface — submitting it won't yet save anything.
      </p>

      <div className="flex border border-forest/20 rounded-full p-1 mb-8 w-fit">
        <button
          onClick={() => setMode("login")}
          className={`px-5 py-2 rounded-full text-sm font-mono transition-colors ${
            mode === "login" ? "bg-forest text-cream" : "text-forest-dark"
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-5 py-2 rounded-full text-sm font-mono transition-colors ${
            mode === "register" ? "bg-forest text-cream" : "text-forest-dark"
          }`}
        >
          Register
        </button>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Account system isn't connected yet — this is a UI preview.");
        }}
      >
        {mode === "register" && (
          <div>
            <label className="text-sm font-mono text-charcoal/70 block mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              className="w-full border border-forest/20 rounded px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">
            Email address
          </label>
          <input
            type="email"
            required
            className="w-full border border-forest/20 rounded px-3 py-2"
          />
        </div>

        {mode === "register" && (
          <div>
            <label className="text-sm font-mono text-charcoal/70 block mb-1">
              Phone number
            </label>
            <input
              type="tel"
              className="w-full border border-forest/20 rounded px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-mono text-charcoal/70 block mb-1">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full border border-forest/20 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
