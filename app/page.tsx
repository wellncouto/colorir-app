import { Button, Heading, Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-20 relative overflow-hidden bg-polar">
      {/* decorações kids sutis */}
      <div className="absolute top-12 left-10 lg:left-32 text-bee text-3xl select-none rotate-12">★</div>
      <div className="absolute top-40 right-12 lg:right-40 text-cardinal text-2xl select-none">♥</div>
      <div className="absolute bottom-32 left-16 lg:left-48 text-macaw text-xl select-none">◆</div>
      <div className="absolute bottom-20 right-10 lg:right-32 text-owl text-3xl select-none -rotate-12">★</div>

      <div className="max-w-3xl w-full text-center relative">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-pill bg-owl shadow-lip-owl mb-10">
          <span className="text-5xl">🎨</span>
        </div>
        <Heading level={1} className="mb-5">
          Meu livro pra colorir
        </Heading>
        <Text size="body" muted className="mb-10 max-w-xl mx-auto">
          Transforme as fotos da sua família em desenhos pra colorir, em A4 alta qualidade pronto pra imprimir.
        </Text>
        <a
          href="https://wa.me/5547991100824?text=Quero%20meu%20livro%20pra%20colorir"
        >
          <Button variant="primary" size="lg">
            Falar no WhatsApp
          </Button>
        </a>
        <Text size="caption" muted className="mt-10 text-sm">
          Acesso exclusivo via link único enviado pelo WhatsApp
        </Text>
      </div>
    </main>
  );
}
