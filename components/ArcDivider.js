// Signature section divider — a rising-sun arc echoing the badge logo,
// used sparingly between major sections rather than a plain straight line.
export default function ArcDivider({ flip = false, color = "#1B3B1F" }) {
  return (
    <div className={`arc-divider ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path
          d="M0,80 C 200,10 400,0 600,0 C 800,0 1000,10 1200,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
