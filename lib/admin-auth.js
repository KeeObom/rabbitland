// Password login for the /admin area (server-only).
//
// Set ADMIN_PASSWORD in .env.local. After a successful login the browser
// gets a signed, HTTP-only cookie valid for 7 days. Changing ADMIN_PASSWORD
// (or ADMIN_SESSION_SECRET) logs everyone out.

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "rl_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare hashes so the comparison takes the same time whatever the length.
  const h = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
  return safeEqual(h(password), h(expected));
}

export function startSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = `${expires}.${sign(String(expires))}`;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function endSession() {
  cookies().delete(COOKIE);
}

export function isAdmin() {
  if (!adminConfigured()) return false;
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || !safeEqual(sig, sign(expires))) return false;
  return Number(expires) > Date.now() / 1000;
}

/** Use at the top of every admin page and server action. */
export function requireAdmin() {
  if (!isAdmin()) redirect("/admin/login");
}
