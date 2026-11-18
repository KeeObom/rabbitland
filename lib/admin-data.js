// Database reads for the admin area (server-only, always fresh — no cache).
import { sb } from "@/lib/supabase";

export const ORDER_STATUSES = ["pending", "paid", "processing", "dispatched", "completed", "cancelled"];

// Tabs on the Orders page
export const ORDER_VIEWS = {
  todo: { label: "To handle", statuses: ["paid", "processing"] },
  dispatched: { label: "Dispatched", statuses: ["dispatched"] },
  completed: { label: "Completed", statuses: ["completed"] },
  abandoned: { label: "Unpaid / abandoned", statuses: ["pending"] },
  cancelled: { label: "Cancelled", statuses: ["cancelled"] },
  all: { label: "All", statuses: null },
};

const PAID_STATUSES = "(paid,processing,dispatched,completed)";

export async function listOrders(view = "todo") {
  const v = ORDER_VIEWS[view] || ORDER_VIEWS.todo;
  const filter = v.statuses ? `&status=in.(${v.statuses.join(",")})` : "";
  return sb(`orders?select=*${filter}&order=created_at.desc&limit=200`);
}

export async function getOrder(reference) {
  const rows = await sb(`orders?select=*&reference=eq.${encodeURIComponent(reference)}&limit=1`);
  return rows[0] || null;
}

export async function listProducts() {
  return sb("products?select=*&order=category.asc,sort_order.asc,name.asc");
}

export async function getProductRow(slug) {
  const rows = await sb(`products?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] || null;
}

export async function listSessions() {
  return sb("training_sessions?select=*&order=starts_at.desc");
}

export async function getSessionRow(slug) {
  const rows = await sb(`training_sessions?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] || null;
}

export async function listRegistrations(sessionId) {
  return sb(
    `training_registrations?select=*&session_id=eq.${sessionId}&status=eq.paid&order=created_at.asc`
  );
}

export async function listMessages(showHandled = false) {
  const filter = showHandled ? "" : "&handled=eq.false";
  return sb(`contact_messages?select=*${filter}&order=created_at.desc&limit=200`);
}

export async function getDashboardStats() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [todo, monthOrders, messages, products, sessions] = await Promise.all([
    sb("orders?select=reference,total,status,customer_name,created_at&status=in.(paid,processing)&order=created_at.asc"),
    sb(`orders?select=total&status=in.${PAID_STATUSES}&paid_at=gte.${monthStart.toISOString()}`),
    sb("contact_messages?select=id&handled=eq.false"),
    sb("products?select=slug,name,stock,category&active=eq.true&stock=not.is.null&stock=lte.5&order=stock.asc"),
    sb(`training_sessions?select=slug,title,starts_at,capacity,seats_taken&active=eq.true&starts_at=gte.${new Date().toISOString()}&order=starts_at.asc&limit=3`),
  ]);

  return {
    todo,
    monthRevenue: monthOrders.reduce((s, o) => s + o.total, 0),
    monthOrderCount: monthOrders.length,
    unreadMessages: messages.length,
    lowStock: products,
    upcomingSessions: sessions,
  };
}
