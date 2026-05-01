import { Heading, Text } from "@/components/ui";

export const metadata = { title: "Termos de Uso" };

export default function Termos() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <Heading level={2} className="mb-2">
        Termos de Uso
      </Heading>
      <Text size="caption" muted className="mb-10">
        Última atualização: maio de 2026
      </Text>
      <div className="space-y-6">
        <section>
          <Heading level={5} className="mb-2">1. Sobre o serviço</Heading>
          <Text className="text-base">
            Geramos um livro pra colorir personalizado em PDF a partir das fotos que você envia.
            O resultado é um arquivo digital A4 pronto pra imprimir em casa ou em gráfica.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">2. Pagamento</Heading>
          <Text className="text-base">
            Pagamento via PIX. Após confirmação do PIX por nossa equipe, o PDF final é liberado.
            Pacotes a partir de R$ 19,90.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">3. Direitos sobre as fotos</Heading>
          <Text className="text-base">
            Você confirma ter direito de usar as fotos enviadas. Não nos responsabilizamos por uso
            indevido de imagens de terceiros sem autorização.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">4. Reembolso</Heading>
          <Text className="text-base">
            Pelo caráter personalizado e digital do produto, não oferecemos reembolso após o PDF
            ser gerado. Se houver problema técnico, entre em contato pelo WhatsApp pra resolver.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">5. Suporte</Heading>
          <Text className="text-base">
            Atendimento exclusivo via WhatsApp +55 47 99110-0824, segunda a sábado das 9h às 21h.
          </Text>
        </section>
      </div>
    </main>
  );
}
