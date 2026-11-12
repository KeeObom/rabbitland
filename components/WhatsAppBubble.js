import { whatsappLink } from "@/lib/config";

export default function WhatsAppBubble() {
  return (
    <a
      href={whatsappLink("Hello Rabbit Land! I'd like to make an enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-2"
    >
      <span className="hidden sm:block bg-cream text-forest-dark text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        Chat with us
      </span>
      <span className="w-14 h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff" aria-hidden="true">
          <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.6c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.56 10.56 0 0 1 5.4 16c0-5.86 4.77-10.62 10.64-10.62 5.86 0 10.6 4.76 10.6 10.62 0 5.85-4.75 10.6-10.6 10.6Zm5.82-7.95c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58-.94-.84-1.58-1.88-1.77-2.2-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.35-.26-.62-.52-.53-.71-.54h-.6c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </a>
  );
}
