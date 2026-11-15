// Minimal server-side Supabase client using the REST API (no extra npm
// packages needed). Only import this from server code: pages, route
// handlers and lib files that never run in the browser — it uses the
// service-role key, which must never reach the client.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(SUPABASE_URL && SERVICE_KEY);

// Catch the most common setup mistake: pasting the public "anon" key instead
// of the "service_role" key. With the anon key, every query quietly returns
// nothing (the tables are locked by Row Level Security), so the site looks empty.
if (SERVICE_KEY && SERVICE_KEY.startsWith("eyJ")) {
  try {
    const payload = JSON.parse(Buffer.from(SERVICE_KEY.split(".")[1], "base64url").toString());
    if (payload.role !== "service_role") {
      console.warn(
        `\n⚠️  SUPABASE_SERVICE_ROLE_KEY is a "${payload.role}" key, not the service_role key.\n` +
          "   Products, orders and training won't load. In Supabase go to\n" +
          "   Project Settings → API Keys → Legacy API Keys and copy the service_role key,\n" +
          "   then restart `npm run dev`.\n"
      );
    }
  } catch {
    // Not a JWT we can read — ignore.
  }
}

/**
 * Call the Supabase REST API.
 * @param {string} path e.g. "products?select=*&active=eq.true"
 * @param {object} opts { method, body, prefer, revalidate }
 *   revalidate: seconds to cache a GET (default: no cache)
 */
export async function sb(path, { method = "GET", body, prefer, revalidate } = {}) {
  if (!hasSupabase) throw new Error("Supabase is not configured");

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;

  const init = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);
  if (method === "GET" && revalidate) init.next = { revalidate };
  else init.cache = "no-store";

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`Supabase ${method} ${path.split("?")[0]} failed: ${res.status} ${text}`);
  }
  return data;
}

export function inList(values) {
  return `(${values.map((v) => `"${String(v).replace(/"/g, "")}"`).join(",")})`;
}
