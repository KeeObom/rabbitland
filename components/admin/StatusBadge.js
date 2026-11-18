const styles = {
  pending: "bg-charcoal/10 text-charcoal/60",
  paid: "bg-gold/25 text-gold-dark",
  processing: "bg-gold/25 text-gold-dark",
  dispatched: "bg-sage/30 text-forest-dark",
  completed: "bg-forest text-cream",
  cancelled: "bg-red-100 text-red-800",
};

const labels = { pending: "Unpaid", paid: "Paid — new" };

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block font-mono text-[0.65rem] uppercase tracking-widest rounded-full px-2 py-0.5 ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}
