export function formatNaira(amount) {
  return "₦" + Number(amount || 0).toLocaleString("en-NG");
}

export function formatDateTime(iso) {
  if (!iso) return "Date to be announced";
  return new Date(iso).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });
}
