import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
        404
      </span>
      <h1 className="font-display text-4xl text-forest-dark mt-2 mb-4">
        This page hopped off somewhere
      </h1>
      <p className="text-charcoal/70 mb-8">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-forest text-cream font-mono text-sm uppercase tracking-wide px-6 py-3 rounded-full hover:bg-forest-light transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
