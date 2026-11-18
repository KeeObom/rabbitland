"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/training", label: "Training" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav({ unread = 0, todo = 0 }) {
  const pathname = usePathname();
  const badge = { "/admin/orders": todo, "/admin/messages": unread };
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              active ? "bg-cream text-forest-dark" : "text-cream/80 hover:bg-forest-light hover:text-cream"
            }`}
          >
            {l.label}
            {badge[l.href] > 0 && (
              <span className="bg-gold text-forest-dark font-mono text-[0.65rem] rounded-full px-1.5 py-0.5">
                {badge[l.href]}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
