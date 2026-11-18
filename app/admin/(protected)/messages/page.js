import Link from "next/link";
import { listMessages } from "@/lib/admin-data";
import { setMessageHandled } from "@/app/admin/actions";
import { formatDateTime } from "@/lib/format";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function AdminMessages({ searchParams }) {
  const showAll = searchParams?.show === "all";
  const messages = await listMessages(showAll);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-forest-dark">Messages</h1>
        <Link href={showAll ? "/admin/messages" : "/admin/messages?show=all"} className="text-sm underline underline-offset-4 text-charcoal/70">
          {showAll ? "Show unread only" : "Show all, including done"}
        </Link>
      </div>

      {messages.length === 0 ? (
        <p className="text-charcoal/60">{showAll ? "No messages yet." : "No unread messages. 🎉"}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {messages.map((m) => (
            <li key={m.id} className={`border rounded-xl p-5 bg-white/70 ${m.handled ? "border-forest/10 opacity-60" : "border-forest/20"}`}>
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <span className="font-medium text-forest-dark">{m.name}</span>
                  {m.topic && <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-widest text-gold-dark">{m.topic}</span>}
                </div>
                <span className="text-xs text-charcoal/55">{formatDateTime(m.created_at)}</span>
              </div>
              <p className="text-sm text-charcoal/80 whitespace-pre-wrap mb-4">{m.message}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Rabbit Land")}`} className="underline">Reply by email</a>
                {m.phone && <a href={`tel:${m.phone}`} className="underline">{m.phone}</a>}
                <form action={setMessageHandled} className="ml-auto">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="handled" value={m.handled ? "false" : "true"} />
                  <SubmitButton pendingText="…" className="!px-4 !py-1.5">{m.handled ? "Mark unread" : "Mark done"}</SubmitButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
