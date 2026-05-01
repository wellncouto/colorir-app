import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/5547991100824";

export function Footer() {
  return (
    <footer className="border-t-2 border-swan bg-snow">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="text-wolf text-xs font-bold">
          © {new Date().getFullYear()} · Feito com 💛
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold uppercase tracking-wider">
          <Link href="/termos" className="text-wolf hover:text-eel transition-colors">
            Termos
          </Link>
          <Link href="/politica" className="text-wolf hover:text-eel transition-colors">
            Privacidade
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
            className="text-owl hover:brightness-110 transition-all flex items-center gap-1"
          >
            💬 WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
