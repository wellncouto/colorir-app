"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card, Heading, Text, Toast } from "@/components/ui";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL!;
const fmtBRL = (c: number) => `R$ ${(c / 100).toFixed(2).replace(".", ",")}`;

type Foto = { posicao: number; eh_capa: boolean; status: string; erro_msg: string | null };
type Data = {
  token: string;
  qtd_fotos: number;
  valor_centavos: number;
  pdf_preview_url: string | null;
  fotos: Foto[];
  pix_chave: string;
  whatsapp_url: string;
};

const Page = ({ src }: { src: string }) => (
  <div className="w-full h-full bg-snow flex items-center justify-center overflow-hidden">
    <img src={src} alt="" className="max-w-full max-h-full object-contain block" />
  </div>
);

export default function PreviewState({
  data, token, copyPix, toast,
}: {
  data: Data;
  token: string;
  copyPix: () => void;
  toast: string;
}) {
  const [pixOpen, setPixOpen] = useState(false);
  const bookRef = useRef<any>(null);
  const okFotos = data.fotos.filter((f) => f.status === "OK").sort((a, b) => a.posicao - b.posicao);

  // Dimensão fixa pra react-pageflip (proporcional A4 portrait)
  const W = 360;
  const H = 510;

  return (
    <main className="min-h-dvh bg-polar pb-32">
      <div className="px-4 lg:px-12 py-10 lg:py-16 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Text size="caption" muted className="uppercase tracking-wider mb-2">✨ Preview pronto</Text>
          <Heading level={2} className="mb-2">Tá lindo!</Heading>
          <Text muted>Arrasta a página pro lado pra ver as próximas 👉</Text>
        </div>

        <div className="flex justify-center mb-8">
          <div style={{ width: W, height: H }} className="shadow-lip-eel rounded-lg">
            <HTMLFlipBook
              ref={bookRef}
              width={W}
              height={H}
              size="fixed"
              showCover
              mobileScrollSupport
              maxShadowOpacity={0.5}
              className=""
              style={{}}
              startPage={0}
              minWidth={W}
              maxWidth={W}
              minHeight={H}
              maxHeight={H}
              drawShadow
              flippingTime={700}
              usePortrait
              startZIndex={0}
              autoSize={false}
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
            >
              {okFotos.map((f) => (
                <div key={f.posicao} style={{ width: W, height: H }}>
                  <Page src={`${API}/colorir/album/${token}/pagina/${f.posicao}`} />
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            className="w-12 h-12 rounded-pill bg-snow border-2 border-swan font-extrabold text-eel hover:bg-polar"
            aria-label="Anterior"
          >‹</button>
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            className="w-12 h-12 rounded-pill bg-owl text-snow font-extrabold shadow-lip-owl active:translate-y-1 active:shadow-none"
            aria-label="Próxima"
          >›</button>
        </div>

        {!pixOpen && (
          <div className="max-w-md mx-auto">
            <Button variant="primary" size="lg" fullWidth onClick={() => setPixOpen(true)}>
              🖨️ Liberar alta qualidade pra impressão
            </Button>
            <Text size="caption" muted className="mt-3 text-center">
              {fmtBRL(data.valor_centavos)} · PDF clean sem marca d&apos;água
            </Text>
          </div>
        )}

        {pixOpen && (
          <Card className="max-w-md mx-auto">
            <Text size="caption" muted className="uppercase tracking-wider mb-1 text-xs">
              Pra liberar sem marca d&apos;água
            </Text>
            <div className="text-page-title-lg font-extrabold text-eel mb-4">{fmtBRL(data.valor_centavos)}</div>
            <div className="bg-polar border-2 border-swan rounded p-3 mb-3">
              <Text size="caption" muted className="uppercase tracking-wider text-xs mb-1">
                Chave PIX (copia e cola)
              </Text>
              <div className="font-mono text-sm text-eel break-all">{data.pix_chave}</div>
            </div>
            <Button variant="info" size="lg" fullWidth onClick={copyPix}>
              📋 Copiar chave PIX
            </Button>
            <a href={data.whatsapp_url} target="_blank" rel="noopener" className="block mt-2">
              <Button variant="primary" size="lg" fullWidth>💬 Enviar comprovante</Button>
            </a>
            <Text size="caption" muted className="mt-4 text-xs text-center">
              Após o pagamento, em segundos seu PDF fica liberado aqui mesmo.
            </Text>
          </Card>
        )}
      </div>

      {pixOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-snow border-t-2 border-swan p-4 lg:hidden z-40">
          <div className="max-w-md mx-auto flex gap-2">
            <Button variant="info" size="md" onClick={copyPix} className="flex-1">📋 Copiar PIX</Button>
            <a href={data.whatsapp_url} target="_blank" rel="noopener" className="flex-1">
              <Button variant="primary" size="md" fullWidth>💬 Comprovante</Button>
            </a>
          </div>
        </div>
      )}

      <Toast visible={!!toast}>{toast}</Toast>
    </main>
  );
}
