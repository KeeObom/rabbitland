// Renders a real photo if it exists in /public/images, or a labelled
// placeholder swatch if it doesn't (so the site looks complete before
// real photography is added). Swap in real <Image> usage once photos land.
export default function ImageSwatch({ label, className = "", tone = "forest" }) {
  const tones = {
    forest: "bg-forest text-cream",
    sage: "bg-sage text-forest-dark",
    gold: "bg-gold text-forest-dark",
    cream: "bg-cream text-forest border border-forest/20",
  };

  return (
    <div
      className={`flex items-center justify-center text-center p-4 ${tones[tone]} ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-widest opacity-80">
        {label}
      </span>
    </div>
  );
}
