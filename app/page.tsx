import { Button, Heading, Text } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-20 bg-polar">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-pill bg-owl shadow-lip-owl mb-10">
          <span className="text-5xl">🎨</span>
        </div>
        <Heading level={1} className="mb-5">
          Meu livro pra colorir
        </Heading>
        <Text size="body" muted className="mb-10 max-w-xl mx-auto">
          Transforme as fotos da sua família em desenhos pra colorir, em A4 alta qualidade pronto pra imprimir.
        </Text>
        <a href="https://wa.me/5547991100824?text=Quero%20meu%20livro%20pra%20colorir">
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
