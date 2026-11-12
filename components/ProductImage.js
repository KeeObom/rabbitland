import ImageSwatch from "./ImageSwatch";

// Shows the product photo if it has a real URL (e.g. Supabase Storage),
// otherwise a labelled placeholder swatch.
export default function ProductImage({ src, alt, className = "", tone = "sage" }) {
  if (src && /^https?:\/\//.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  }
  return <ImageSwatch label={alt} className={className} tone={tone} />;
}
