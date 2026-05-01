import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/5547991100824";

export function Footer() {
  return (
    <footer className="border-t-2 border-swan bg-snow">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Marca */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-pill bg-owl shadow-lip-owl flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
              <span className="font-display text-eel text-heading-xs">colorir</span>
            </Link>
            <p className="text-wolf text-sm font-bold max-w-md">
              Transformamos as fotos da sua família em desenhos pra colorir, em PDF A4 alta qualidade pronto pra imprimir.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2 lg:items-end">
            <p className="text-label-sm uppercase text-wolf mb-1">Atendimento</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="text-eel font-extrabold hover:text-owl transition-colors flex items-center gap-2"
            >
              💬 WhatsApp
            </a>
            <a
              href={`${WHATSAPP_URL}?text=Tenho%20uma%20d%C3%BAvida`}
              target="_blank"
              rel="noopener"
              className="text-wolf font-bold hover:text-eel transition-colors"
            >
              Tirar dúvidas
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-swan flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between items-start lg:items-center">
          <p className="text-wolf text-sm font-bold">
            © {new Date().getFullYear()} colorir · Feito com 💛 pras famílias
          </p>
          <p className="text-hare text-xs font-bold uppercase tracking-wider">
            Pagamento via PIX · Entrega no WhatsApp
          </p>
        </div>
      </div>
    </footer>
  );
}
