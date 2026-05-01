import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/5547991100824?text=Oi%2C%20vim%20do%20site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-snow border-b-2 border-swan">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-pill bg-owl shadow-lip-owl flex items-center justify-center transition-transform group-active:translate-y-[2px] group-active:[box-shadow:0_2px_0_#58a700]">
            <span className="text-xl">🎨</span>
          </div>
          <span className="font-display text-eel text-heading-xs lg:text-heading-sm">
            colorir
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="hidden lg:inline-flex items-center text-label-sm uppercase font-extrabold text-wolf hover:text-eel transition-colors px-3 py-2"
          >
            Ajuda
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-label-sm uppercase font-extrabold text-snow bg-owl shadow-lip-owl rounded px-4 py-2 active:translate-y-[2px] active:[box-shadow:0_2px_0_#58a700] hover:brightness-110 transition-all"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
