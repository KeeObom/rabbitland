import Link from "next/link";
import SessionForm from "@/components/admin/SessionForm";
import Notice from "@/components/admin/Notice";

export default function NewSessionPage({ searchParams }) {
  return (
    <div>
      <Link href="/admin/training" className="text-sm text-charcoal/60 hover:text-gold-dark">← Training</Link>
      <h1 className="font-display text-3xl text-forest-dark mt-3 mb-6">New training session</h1>
      <Notice searchParams={searchParams} />
      <SessionForm />
    </div>
  );
}
