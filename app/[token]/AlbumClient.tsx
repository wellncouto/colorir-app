"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Heading, Text, Label, Input, Pill, Divider, Toast } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL!;

type Foto = {
  posicao: number;
  eh_capa: boolean;
  status: string;
  erro_msg: string | null;
};
type Status = {
  token: string;
  status: string;
  qtd_fotos: number;
  fotos_uploaded: number;
  nome: string | null;
  capa_estilo: string | null;
  valor_centavos: number;
  pdf_preview_url: string | null;
  pdf_final_url: string | null;
  fotos: Foto[];
  pix_chave: string;
  whatsapp_url: string;
};

const fmtBRL = (centavos: number) => `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;

type Step = "capa" | "nome" | "estilo" | "paginas" | "revisao";
const STEPS: Step[] = ["capa", "nome", "estilo", "paginas", "revisao"];

export default function AlbumClient({ token }: { token: string }) {
  const [data, setData] = useState<Status | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [nome, setNome] = useState("");
  const [estilo, setEstilo] = useState<"familia" | "rosa" | "azul">("familia");
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("capa");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch(`${API}/colorir/album/${token}/status`);
      if (!r.ok) throw new Error(`status ${r.status}`);
      const j: Status = await r.json();
      setData(j);
      if (!nome && j.nome) setNome(j.nome);
      if (j.capa_estilo === "rosa" || j.capa_estilo === "azul" || j.capa_estilo === "familia") {
        setEstilo(j.capa_estilo);
      }
    } catch (e: any) {
      setErr(e.message);
    }
  }, [token, nome]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (data?.status === "PROCESSANDO") {
      const id = setInterval(fetchStatus, 4000);
      return () => clearInterval(id);
    }
  }, [data?.status, fetchStatus]);

  useEffect(() => {
    const k = `colorir:${token}`;
    const saved = localStorage.getItem(k);
    if (saved) {
      try {
        const o = JSON.parse(saved);
        if (o.nome) setNome(o.nome);
        if (o.estilo) setEstilo(o.estilo);
        if (o.step && STEPS.includes(o.step)) setStep(o.step);
      } catch {}
    }
  }, [token]);
  useEffect(() => {
    localStorage.setItem(`colorir:${token}`, JSON.stringify({ nome, estilo, step }));
  }, [token, nome, estilo, step]);

  const onUpload = async (posicao: number, file: File) => {
    setUploading((s) => ({ ...s, [posicao]: true }));
    setErr(null);
    const url = URL.createObjectURL(file);
    setThumbs((t) => ({ ...t, [posicao]: url }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("posicao", String(posicao));
      fd.append("eh_capa", posicao === 0 ? "true" : "false");
      const r = await fetch(`${API}/colorir/album/${token}/upload`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error(`upload ${r.status}: ${await r.text()}`);
      await fetchStatus();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading((s) => ({ ...s, [posicao]: false }));
    }
  };

  const onDelete = async (posicao: number) => {
    setErr(null);
    setThumbs((t) => {
      const n = { ...t };
      delete n[posicao];
      return n;
    });
    try {
      const r = await fetch(`${API}/colorir/album/${token}/foto/${posicao}`, {
        method: "DELETE",
      });
      if (!r.ok) throw new Error(`delete ${r.status}`);
      await fetchStatus();
    } catch (e: any) {
      setErr(e.message);
      await fetchStatus();
    }
  };

  const onProcessar = async () => {
    if (!data) return;
    if (data.fotos_uploaded < 1) {
      setErr("envie pelo menos a capa antes de continuar");
      return;
    }
    setEnviando(true);
    setErr(null);
    try {
      const r = await fetch(`${API}/colorir/album/${token}/processar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome || null, capa_estilo: estilo }),
      });
      if (!r.ok) throw new Error(`processar ${r.status}: ${await r.text()}`);
      await fetchStatus();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const copyPix = async () => {
    if (!data?.pix_chave) return;
    try {
      await navigator.clipboard.writeText(data.pix_chave);
      showToast("Chave PIX copiada ✓");
    } catch {
      showToast("Não consegui copiar — copia manual");
    }
  };

  if (!data && !err) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <Text muted>carregando...</Text>
      </main>
    );
  }
  if (err && !data) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6">
        <Text muted>Não foi possível carregar.</Text>
        <Button
          variant="secondary"
          onClick={() => {
            setErr(null);
            fetchStatus();
          }}
        >
          Tentar de novo
        </Button>
      </main>
    );
  }
  if (!data) return null;

  // ===== Estado: PAGO =====
  if (data.status === "PAGO") {
    return (
      <main className="min-h-dvh px-6 py-20 flex items-center justify-center bg-polar">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-pill bg-owl shadow-lip-owl mb-10 pop">
            <span className="text-4xl">🎉</span>
          </div>
          <Heading level={2} className="mb-3">Prontinho!</Heading>
          <Text muted className="mb-10">
            Seu livro tá pronto pra imprimir, em A4 alta qualidade.
          </Text>
          <a href={`${API}/colorir/album/${token}/pdf-final`} className="block mb-3">
            <Button variant="primary" size="lg" fullWidth>📥 Baixar PDF</Button>
          </a>
          <a href="https://wa.me/554735132596?text=Quero%20fazer%20outro%20livro" className="block">
            <Button variant="secondary" size="lg" fullWidth>Fazer outro</Button>
          </a>
        </div>
      </main>
    );
  }

  // ===== Estado: PREVIEW =====
  if (data.status === "PREVIEW") {
    return (
      <main className="min-h-dvh bg-polar pb-32 lg:pb-12">
        <div className="px-6 lg:px-12 py-12 lg:py-20 max-w-6xl mx-auto">
          <div className="text-center lg:text-left mb-8 lg:mb-12">
            <Text size="caption" muted className="uppercase tracking-wider mb-2">✨ Preview pronto</Text>
            <Heading level={2} className="mb-2">Tá lindo!</Heading>
            <Text muted className="lg:max-w-xl">
              Confere como ficou seu livrinho e libera a versão final sem marca d&apos;água.
            </Text>
          </div>
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
            <div className="rounded-lg border-2 border-swan overflow-hidden bg-snow">
              <img src={`${API}/colorir/album/${token}/preview-image`} alt="" className="w-full h-auto block" />
            </div>
            <Card className="lg:sticky lg:top-8">
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
              {data.pdf_preview_url && (
                <a href={`${API}/colorir/album/${token}/preview`} target="_blank" rel="noopener"
                  className="block text-center mt-4 text-macaw underline text-sm font-bold">
                  Ver PDF completo →
                </a>
              )}
            </Card>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-snow border-t-2 border-swan p-4 lg:hidden z-40">
          <div className="max-w-md mx-auto flex gap-2">
            <Button variant="info" size="md" onClick={copyPix} className="flex-1">📋 Copiar PIX</Button>
            <a href={data.whatsapp_url} target="_blank" rel="noopener" className="flex-1">
              <Button variant="primary" size="md" fullWidth>💬 Comprovante</Button>
            </a>
          </div>
        </div>
        <Toast visible={!!toast}>{toast}</Toast>
      </main>
    );
  }

  // ===== Estado: PROCESSANDO =====
  if (data.status === "PROCESSANDO") {
    return (
      <main className="min-h-dvh px-6 py-20 flex items-center justify-center bg-polar">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-pill bg-tree-frog shadow-lip-tree-frog mb-10 pop">
            <span className="text-4xl">✓</span>
          </div>
          <Heading level={2} className="mb-3">Pedido enviado!</Heading>
          <Text muted>
            Você vai receber o livro pronto direto no seu WhatsApp 🤝
          </Text>
        </div>
      </main>
    );
  }

  // ===== NOVO / AGUARDA_ENVIO =====
  // Mobile: WIZARD step-by-step
  // Desktop: layout 2-col atual

  const stepIndex = STEPS.indexOf(step);
  const capaUploaded = data.fotos.some((f) => f.posicao === 0);
  const paginasUploaded = data.fotos.filter((f) => !f.eh_capa).length;
  const podeAvancar: Record<Step, boolean> = {
    capa: capaUploaded,
    nome: nome.trim().length >= 2,
    estilo: !!estilo,
    paginas: true, // pode pular páginas (mínimo 1 = capa)
    revisao: capaUploaded,
  };
  const stepLabels: Record<Step, string> = {
    capa: "Capa",
    nome: "Nome",
    estilo: "Estilo",
    paginas: "Páginas",
    revisao: "Revisão",
  };

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const prev = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const slots = Array.from({ length: data.qtd_fotos + 1 }, (_, i) => i);

  return (
    <>
      {/* ====== WIZARD UNIFICADO (mobile + desktop centralizado) ====== */}
      <main className="min-h-dvh bg-polar flex flex-col">
        {/* Top bar com Voltar + progress */}
        <div className="sticky top-0 z-30 bg-snow border-b-2 border-swan px-4 py-3 lg:px-8 lg:py-4">
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="w-10 h-10 rounded-pill flex items-center justify-center text-eel disabled:opacity-30 active:bg-polar"
              aria-label="Voltar"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <Text size="caption" bold className="text-xs uppercase tracking-wider">
                  {stepLabels[step]}
                </Text>
                <Text size="caption" muted className="text-xs font-bold">
                  {stepIndex + 1}/{STEPS.length}
                </Text>
              </div>
              <div className="h-2 bg-swan rounded-pill overflow-hidden">
                <div
                  className="h-full bg-owl rounded-pill transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-8 lg:py-16 max-w-2xl mx-auto w-full">
          {step === "capa" && (
            <div>
              <Heading level={3} className="mb-2">Foto principal</Heading>
              <Text muted className="mb-8 text-base">
                Essa foto vira a capa do livrinho, em estilo Pixar 3D colorido.
              </Text>
              <div className="max-w-xs mx-auto">
                <PhotoSlot
                  posicao={0}
                  token={token}
                  isCapa
                  uploading={uploading[0]}
                  thumb={thumbs[0]}
                  uploaded={capaUploaded}
                  onPick={(file) => onUpload(0, file)}
                  onDelete={() => onDelete(0)}
                />
              </div>
            </div>
          )}

          {step === "nome" && (
            <div>
              <Heading level={3} className="mb-2">Nome na capa</Heading>
              <Text muted className="mb-8 text-base">
                Aparece grande embaixo da foto. Mínimo 2 letras.
              </Text>
              <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value.slice(0, 30))}
                placeholder="Ex: Família Couto, Livro do Gael..."
                maxLength={30}
                autoFocus
              />
              <Text size="caption" muted className="mt-2 text-xs">{nome.length}/30</Text>
            </div>
          )}

          {step === "estilo" && (
            <div>
              <Heading level={3} className="mb-2">Estilo da capa</Heading>
              <Text muted className="mb-8 text-base">
                Escolha a paleta de cores da capa.
              </Text>
              <div className="space-y-3">
                {([
                  { v: "familia", title: "Dourado", desc: "Tons quentes e amarelados", emoji: "✨" },
                  { v: "rosa", title: "Rosa", desc: "Tons pastel suaves", emoji: "🌸" },
                  { v: "azul", title: "Azul", desc: "Tons frescos e claros", emoji: "🌊" },
                ] as const).map(({ v, title, desc, emoji }) => (
                  <button
                    key={v}
                    onClick={() => setEstilo(v)}
                    type="button"
                    className={[
                      "w-full text-left flex items-center gap-4 p-4 rounded-lg transition-all",
                      "border-2 border-b-4 active:translate-y-[2px] active:border-b-2",
                      estilo === v ? "bg-bluejay/10 border-macaw" : "bg-snow border-swan",
                    ].join(" ")}
                  >
                    <span className="text-3xl">{emoji}</span>
                    <div className="flex-1">
                      <div className="font-extrabold text-eel uppercase text-sm">{title}</div>
                      <div className="text-wolf text-sm font-bold">{desc}</div>
                    </div>
                    {estilo === v && (
                      <span className="w-7 h-7 rounded-pill bg-macaw text-snow flex items-center justify-center font-extrabold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "paginas" && (
            <div>
              <Heading level={3} className="mb-2">Páginas do livro</Heading>
              <Text muted className="mb-8 text-base">
                Adicione até {data.qtd_fotos} fotos · {paginasUploaded}/{data.qtd_fotos} enviadas.
                Pode pular se quiser só a capa.
              </Text>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3">
                {slots.slice(1).map((p) => {
                  const f = data.fotos.find((x) => x.posicao === p);
                  return (
                    <PhotoSlot
                      key={p}
                      posicao={p}
                      token={token}
                      uploading={uploading[p]}
                      thumb={thumbs[p]}
                      uploaded={!!f}
                      onPick={(file) => onUpload(p, file)}
                      onDelete={() => onDelete(p)}
                      small
                      label={String(p)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {step === "revisao" && (
            <div>
              <Heading level={3} className="mb-2">Revisão</Heading>
              <Text muted className="mb-8 text-base">
                Confere tudo antes de mandar processar.
              </Text>
              <div className="space-y-4">
                <ReviewCard label="Capa" onEdit={() => setStep("capa")}>
                  {capaUploaded ? (
                    <div className="w-16 h-16 rounded overflow-hidden border-2 border-swan">
                      <img src={`${API}/colorir/album/${token}/foto/0`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Text size="caption" className="!text-cardinal">Falta a capa</Text>
                  )}
                </ReviewCard>
                <ReviewCard label="Nome" onEdit={() => setStep("nome")}>
                  <Text bold>{nome || <span className="text-hare">— sem nome —</span>}</Text>
                </ReviewCard>
                <ReviewCard label="Estilo" onEdit={() => setStep("estilo")}>
                  <Text bold className="capitalize">{estilo}</Text>
                </ReviewCard>
                <ReviewCard label="Páginas" onEdit={() => setStep("paginas")}>
                  <Text bold>{paginasUploaded}/{data.qtd_fotos}</Text>
                </ReviewCard>
                <Card className="!bg-bee/10 !border-bee">
                  <Text size="caption" muted className="uppercase tracking-wider text-xs mb-1">
                    Próximo passo
                  </Text>
                  <Text bold className="text-base">
                    Vou montar seu livro e te mostrar uma prévia em ~1 min.
                  </Text>
                  <Text size="caption" muted className="mt-2 text-xs">
                    PDF A4 300 DPI · pronto pra imprimir
                  </Text>
                </Card>
              </div>
              {err && (
                <Card className="mt-4 !bg-cardinal/10 !border-cardinal">
                  <Text size="caption" bold className="!text-cardinal">{err}</Text>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Botão fixo inferior */}
        <div className="sticky bottom-0 bg-snow border-t-2 border-swan p-4 lg:py-5 z-40">
          <div className="max-w-2xl mx-auto">
            {step !== "revisao" ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={next}
                disabled={!podeAvancar[step]}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onProcessar}
                disabled={!capaUploaded || enviando}
              >
                {enviando ? "Enviando..." : "Montar meu livro"}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Toast visible={!!toast}>{toast}</Toast>
    </>
  );
}

function ReviewCard({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-snow border-2 border-swan rounded p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <Text size="caption" muted className="uppercase tracking-wider text-xs mb-1">
          {label}
        </Text>
        <div>{children}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-macaw font-extrabold text-sm uppercase tracking-wider px-3 py-1.5 rounded active:bg-bluejay/20"
      >
        Editar
      </button>
    </div>
  );
}

function PhotoSlot({
  posicao,
  token,
  isCapa,
  uploading,
  thumb,
  uploaded,
  onPick,
  onDelete,
  small,
  label,
}: {
  posicao: number;
  token: string;
  isCapa?: boolean;
  uploading?: boolean;
  thumb?: string;
  uploaded?: boolean;
  onPick: (file: File) => void;
  onDelete?: () => void;
  small?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const serverThumb = uploaded && !thumb
    ? `${API}/colorir/album/${token}/foto/${posicao}`
    : null;
  const showThumb = thumb || serverThumb;

  return (
    <div className="relative group">
      <button
        onClick={() => ref.current?.click()}
        type="button"
        title={uploaded ? "Trocar foto" : "Adicionar foto"}
        className={[
          "aspect-square relative w-full overflow-hidden rounded-lg transition-all duration-150",
          "border-2 border-b-4",
          uploaded ? "border-owl bg-snow" : "border-swan bg-snow hover:bg-polar",
          "active:translate-y-[2px] active:border-b-2",
        ].join(" ")}
      >
        {showThumb && <img src={showThumb} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        {!showThumb && !uploaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-hare">
            <span className={small ? "text-2xl font-bold" : "text-4xl font-bold"}>+</span>
            {isCapa && <span className="text-label-sm uppercase mt-2 text-wolf">Adicionar capa</span>}
            {!isCapa && !small && <span className="text-label-sm uppercase mt-1">{label || posicao}</span>}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-snow/80 flex items-center justify-center">
            <div className="w-6 h-6 border-3 border-owl border-t-transparent rounded-pill animate-spin" />
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </button>
      {uploaded && onDelete && !uploading && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-pill bg-cardinal text-snow flex items-center justify-center text-base font-bold shadow-lip-cardinal active:translate-y-[2px] active:[box-shadow:0_2px_0_#ea2b2b]"
          aria-label="Remover foto"
          title="Remover"
        >×</button>
      )}
    </div>
  );
}
