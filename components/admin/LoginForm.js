"use client";

import { useFormState } from "react-dom";
import { login } from "@/app/admin/actions";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const [state, action] = useFormState(login, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="text-sm font-mono text-charcoal/70 block mb-1">Password</label>
        <input id="password" name="password" type="password" required autoFocus autoComplete="current-password"
          className="w-full border border-forest/20 rounded px-3 py-2 bg-white" />
      </div>
      {state?.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
      <SubmitButton pendingText="Checking…">Log in</SubmitButton>
    </form>
  );
}
