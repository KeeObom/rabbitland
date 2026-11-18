"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText = "Saving…", className = "", ...props }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-forest text-cream font-mono text-xs uppercase tracking-wide px-5 py-2.5 rounded-full hover:bg-forest-light transition-colors disabled:opacity-60 ${className}`}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
