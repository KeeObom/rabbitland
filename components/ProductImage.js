"use client";

import { useState } from "react";
import ImageSwatch from "./ImageSwatch";

// Shows the product photo if it loads, otherwise a labelled placeholder
// swatch — so a product without a photo yet never shows a broken image.
export default function ProductImage({ src, alt, className = "", tone = "sage" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed || !/^https?:\/\//.test(src)) {
    return <ImageSwatch label={alt} className={className} tone={tone} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
