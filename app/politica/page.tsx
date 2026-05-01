import { Heading, Text } from "@/components/ui";

export const metadata = { title: "Política de Privacidade" };

export default function Politica() {
  return (
    <main className="px-6 py-16 max-w-3xl mx-auto">
      <Heading level={2} className="mb-2">
        Política de Privacidade
      </Heading>
      <Text size="caption" muted className="mb-10">
        Última atualização: maio de 2026
      </Text>
      <div className="space-y-6">
        <section>
          <Heading level={5} className="mb-2">Que dados coletamos</Heading>
          <Text className="text-base">
            <strong>Número de WhatsApp</strong> (pra te enviar o link único e o PDF) e
            <strong> as fotos que você envia</strong> (apenas pra processá-las e gerar seu livro).
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">O que fazemos com as fotos</Heading>
          <Text className="text-base">
            As fotos são processadas em servidores próprios e enviadas pra OpenAI apenas pra gerar
            os desenhos pra colorir. <strong>Após o pagamento ser confirmado, as fotos originais
            são apagadas</strong> dos nossos servidores. Mantemos apenas o PDF gerado pra você
            poder baixar de novo se quiser.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">Compartilhamento</Heading>
          <Text className="text-base">
            Não vendemos, alugamos ou compartilhamos seus dados com terceiros. As fotos são
            enviadas exclusivamente pra OpenAI (parceiro de processamento) sob acordo de uso
            comercial sem treinamento de modelos.
          </Text>
        </section>
        <section>
          <Heading level={5} className="mb-2">Seus direitos (LGPD)</Heading>
          <Text className="text-base">
            Você pode solicitar a qualquer momento, via WhatsApp:
          </Text>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-eel font-semibold">
            <li>Apagar suas fotos e PDFs</li>
            <li>Apagar seu cadastro completo</li>
            <li>Receber cópia dos seus dados</li>
          </ul>
        </section>
        <section>
          <Heading level={5} className="mb-2">Contato</Heading>
          <Text className="text-base">
            WhatsApp +55 47 99110-0824 — questões de privacidade têm prioridade.
          </Text>
        </section>
      </div>
    </main>
  );
}
