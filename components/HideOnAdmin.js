"use client";

import { usePathname } from "next/navigation";

// Hides the public site's navbar, footer and WhatsApp bubble inside /admin.
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
