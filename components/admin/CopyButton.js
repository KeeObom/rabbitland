"use client";

import { useState } from "react";

export default function CopyButton({ text, children }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copy this:", text);
        }
      }}
      className="text-xs font-mono uppercase tracking-wide border border-forest/25 rounded-full px-3 py-1.5 hover:border-gold"
    >
      {copied ? "Copied ✓" : children}
    </button>
  );
}
