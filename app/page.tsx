import { Button, Heading, Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-section">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-pill bg-charcoal mb-8 lg:mb-10">
          <span className="text-3xl lg:text-4xl">🎨</span>
        </div>
        <Heading level={2} className="mb-5 lg:!text-display-xl">
          Meu livro pra colorir.
        </Heading>
        <Text size="body-lg" muted className="mb-10 lg:mb-12 max-w-xl mx-auto">
          Transforme as fotos da sua família em desenhos pra colorir, em A4 alta qualidade pronto pra imprimir.
        </Text>
        <a
          href="https://wa.me/5547991100824?text=Quero%20meu%20livro%20pra%20colorir"
          className="inline-block"
        >
          <Button variant="primary" size="lg">
            Falar no WhatsApp
          </Button>
        </a>
        <Text size="caption" muted className="mt-10">
          Acesso exclusivo via link único enviado pelo WhatsApp.
        </Text>
      </div>
    </main>
  );
}
