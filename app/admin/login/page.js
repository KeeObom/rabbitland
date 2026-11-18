import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin login | Rabbit Land", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAdmin()) redirect("/admin");
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest px-4">
      <div className="w-full max-w-sm bg-cream rounded-2xl p-8 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">Rabbit Land</span>
        <h1 className="font-display text-3xl text-forest-dark mt-1 mb-6">Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
