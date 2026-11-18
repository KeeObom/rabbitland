import { saveSession } from "@/app/admin/actions";
import SubmitButton from "./SubmitButton";

const input = "w-full border border-forest/20 rounded px-3 py-2 bg-white text-sm";
const label = "text-xs font-mono uppercase tracking-wide text-charcoal/65 block mb-1";

// "2026-12-05T16:00:00+00:00" → "2026-12-05T17:00" (Nigeria time) for the date picker
function toLagosLocal(iso) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

export default function SessionForm({ session }) {
  const isNew = !session;
  const s = session || { active: true, platform: "Zoom", topics: [], capacity: 40 };

  return (
    <form action={saveSession} className="flex flex-col gap-6 max-w-3xl">
      <input type="hidden" name="mode" value={isNew ? "new" : "edit"} />
      {!isNew && <input type="hidden" name="original_slug" value={s.slug} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="title">Title</label>
          <input id="title" name="title" required className={input} defaultValue={s.title || ""} placeholder="Rabbit Farming Foundations — January" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="slug">Web address (slug)</label>
          {isNew ? (
            <>
              <input id="slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={`${input} font-mono`} placeholder="foundations-jan-2027" />
              <p className="text-xs text-charcoal/50 mt-1">Lowercase letters, numbers and dashes. The page will be /training/your-slug.</p>
            </>
          ) : (
            <div className="font-mono text-sm text-charcoal/70 py-2">/training/{s.slug}</div>
          )}
        </div>
        <div>
          <label className={label} htmlFor="starts_at">Starts (Nigeria time)</label>
          <input id="starts_at" name="starts_at" type="datetime-local" required className={input} defaultValue={toLagosLocal(s.starts_at)} />
        </div>
        <div>
          <label className={label} htmlFor="duration_label">Duration</label>
          <input id="duration_label" name="duration_label" className={input} defaultValue={s.duration_label || ""} placeholder="2 evenings · 2 hours each" />
        </div>
        <div>
          <label className={label} htmlFor="platform">Platform</label>
          <input id="platform" name="platform" className={input} defaultValue={s.platform || ""} list="platforms" />
          <datalist id="platforms"><option value="Zoom" /><option value="Google Meet" /><option value="WhatsApp" /></datalist>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="price">Fee (₦)</label>
            <input id="price" name="price" required inputMode="numeric" className={`${input} font-mono`} defaultValue={s.price ?? ""} />
          </div>
          <div>
            <label className={label} htmlFor="capacity">Seats</label>
            <input id="capacity" name="capacity" required inputMode="numeric" className={`${input} font-mono`} defaultValue={s.capacity ?? ""} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="summary">Short summary (shown on the list)</label>
          <input id="summary" name="summary" className={input} defaultValue={s.summary || ""} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} className={input} defaultValue={s.description || ""} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="topics">What you'll cover (one per line)</label>
          <textarea id="topics" name="topics" rows={6} className={`${input} font-mono`} defaultValue={(s.topics || []).join("\n")} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={s.active} className="w-4 h-4 accent-[#1B3B1F]" />
          Show on website (open for registration)
        </label>
      </div>

      <div className="border-t border-forest/10 pt-6 flex items-center gap-4">
        <SubmitButton>{isNew ? "Create session" : "Save changes"}</SubmitButton>
        {!isNew && (
          <a href={`/training/${s.slug}`} target="_blank" className="text-sm underline underline-offset-4 text-charcoal/70">View on site ↗</a>
        )}
      </div>
    </form>
  );
}
