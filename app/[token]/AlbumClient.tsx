"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Heading, Text, Label, Input, Pill, Divider } from "@/components/ui";

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
};

const fmtBRL = (centavos: number) => `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;

export default function AlbumClient({ token }: { token: string }) {
  const [data, setData] = useState<Status | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [nome, setNome] = useState("");
  const [estilo, setEstilo] = useState<"familia" | "rosa" | "azul">("familia");
  const [enviando, setEnviando] = useState(false);

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
      } catch {}
    }
  }, [token]);
  useEffect(() => {
    localStorage.setItem(`colorir:${token}`, JSON.stringify({ nome, estilo }));
  }, [token, nome, estilo]);

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
          variant="ghost"
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
      <main className="min-h-dvh px-6 py-section flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-pill bg-charcoal mb-8">
            <span className="text-3xl text-off-white">✓</span>
          </div>
          <Heading level={3} className="mb-3">
            Prontinho! 🎉
          </Heading>
          <Text muted className="mb-10">
            Seu livro tá pronto pra imprimir, em A4 alta qualidade.
          </Text>
          <a href={`${API}/colorir/album/${token}/pdf-final`} className="block">
            <Button variant="primary" size="lg" fullWidth>
              Baixar PDF
            </Button>
          </a>
          <a
            href="https://wa.me/5547991100824?text=Quero%20fazer%20outro%20livro%20pra%20colorir"
            className="block mt-3"
          >
            <Button variant="ghost" size="lg" fullWidth>
              Fazer outro livro
            </Button>
          </a>
        </div>
      </main>
    );
  }

  // ===== Estado: PREVIEW =====
  if (data.status === "PREVIEW") {
    return (
      <main className="min-h-dvh px-6 lg:px-12 py-12 lg:py-section max-w-6xl mx-auto">
        <div className="text-center lg:text-left mb-10 lg:mb-16">
          <Text size="caption" muted className="tracking-wide uppercase mb-2">
            ✦ Preview pronto
          </Text>
          <Heading level={3} className="mb-2">
            Tá lindo! ✨
          </Heading>
          <Text muted className="lg:max-w-xl">
            Confere o preview do seu livrinho e libera a versão final sem marca d&apos;água.
          </Text>
        </div>
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
          <div className="rounded border border-border-soft overflow-hidden bg-cream">
            <iframe
              src={`${API}/colorir/album/${token}/preview`}
              className="w-full aspect-[210/297] block"
            />
          </div>
          <Card className="lg:sticky lg:top-8">
            <Text size="caption" muted className="mb-1">
              Versão sem marca d&apos;água
            </Text>
            <Heading level={2} className="mb-2">
              {fmtBRL(data.valor_centavos)}
            </Heading>
            <Text size="label" muted className="mb-5">
              Manda o PIX pelo WhatsApp e em segundos seu PDF final é liberado aqui.
            </Text>
            <a href="https://wa.me/5547991100824?text=Já%20fiz%20o%20pix%2C%20segue%20comprovante">
              <Button variant="primary" size="lg" fullWidth>
                Pagar via WhatsApp
              </Button>
            </a>
          </Card>
        </div>
      </main>
    );
  }

  // ===== Estado: PROCESSANDO =====
  if (data.status === "PROCESSANDO") {
    const ok = data.fotos.filter((f) => f.status === "OK").length;
    const erro = data.fotos.filter((f) => f.status === "ERRO").length;
    const pct = Math.round(((ok + erro) / Math.max(1, data.fotos.length)) * 100);
    return (
      <main className="min-h-dvh px-6 py-section flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-pill bg-charcoal mb-8">
            <span className="text-xl text-off-white animate-pulse">✦</span>
          </div>
          <Heading level={3} className="mb-3">
            Tô desenhando ✦
          </Heading>
          <Text muted className="mb-10">
            Tô transformando suas fotos em desenhos pra colorir. Pode levar 1–2 minutinhos.
          </Text>
          <Card>
            <div className="h-1 bg-charcoal-4 rounded-pill overflow-hidden mb-3">
              <div
                className="h-full bg-charcoal transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <Text size="caption" muted>
              {ok}/{data.fotos.length} prontas {erro > 0 && `· ${erro} com erro`}
            </Text>
          </Card>
        </div>
      </main>
    );
  }

  // ===== Estado: NOVO / AGUARDA_ENVIO =====
  const slots = Array.from({ length: data.qtd_fotos + 1 }, (_, i) => i);
  const completos = data.fotos.length;
  const pronto = completos >= 1;

  return (
    <main className="min-h-dvh px-6 lg:px-12 pt-12 lg:pt-section pb-32 lg:pb-section max-w-6xl mx-auto">
      <header className="mb-10 lg:mb-16 lg:max-w-xl relative">
        {/* decoração sutil kids */}
        <div className="hidden lg:block absolute -top-4 -right-12 text-coral text-3xl select-none">✦</div>
        <div className="hidden lg:block absolute top-16 -right-8 text-sage text-xl select-none">●</div>
        <Text size="caption" muted className="tracking-wide uppercase mb-2">
          🎨 Álbum personalizado
        </Text>
        <Heading level={3} className="mb-2 lg:!text-display">
          Monte seu livro.
        </Heading>
        <Text size="label" muted>
          {completos}/{data.qtd_fotos + 1} fotos enviadas
        </Text>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
        <div>
          {/* Capa */}
          <section className="mb-10 lg:mb-12">
            <Label>Capa principal</Label>
            <div className="max-w-xs lg:max-w-sm">
              <PhotoSlot
                posicao={0}
                isCapa
                uploading={uploading[0]}
                thumb={thumbs[0]}
                uploaded={data.fotos.some((f) => f.posicao === 0 && f.status === "UPLOADED")}
                onPick={(file) => onUpload(0, file)}
              />
            </div>
          </section>

          <Divider className="mb-10 lg:mb-12" />

          {/* Nome */}
          <section className="mb-10 lg:mb-12">
            <Label>Nome na capa</Label>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value.slice(0, 30))}
              placeholder="Ex: Família Couto, Livro do Gael..."
              maxLength={30}
              className="lg:max-w-md"
            />
          </section>

          {/* Estilo */}
          <section className="mb-10 lg:mb-12">
            <Label>Estilo da capa</Label>
            <div className="flex gap-2 flex-wrap">
              {([
                { v: "familia", label: "Família", dot: "bg-coral" },
                { v: "rosa", label: "Menina", dot: "bg-coral-soft border border-coral" },
                { v: "azul", label: "Menino", dot: "bg-sky-soft border border-sky" },
              ] as const).map(({ v, label, dot }) => (
                <Pill key={v} selected={estilo === v} onClick={() => setEstilo(v)}>
                  <span className={`inline-block w-2.5 h-2.5 rounded-pill ${dot} mr-2`} />
                  {label}
                </Pill>
              ))}
            </div>
          </section>

          <Divider className="mb-10 lg:mb-12" />

          {/* Páginas */}
          <section>
            <Label>Páginas do livro · {data.qtd_fotos} fotos</Label>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
              {slots.slice(1).map((p) => {
                const f = data.fotos.find((x) => x.posicao === p);
                return (
                  <PhotoSlot
                    key={p}
                    posicao={p}
                    uploading={uploading[p]}
                    thumb={thumbs[p]}
                    uploaded={f?.status === "UPLOADED"}
                    onPick={(file) => onUpload(p, file)}
                    small
                    label={String(p)}
                  />
                );
              })}
            </div>
          </section>

          {err && (
            <Text size="caption" className="mt-6 text-red-700">
              {err}
            </Text>
          )}
        </div>

        {/* Sidebar desktop com CTA — em mobile vira footer fixo */}
        <aside className="hidden lg:block lg:sticky lg:top-12">
          <Card>
            <Text size="caption" muted className="mb-1">
              Pacote escolhido
            </Text>
            <Heading level={2} className="mb-2">
              {fmtBRL(data.valor_centavos)}
            </Heading>
            <Text size="label" muted className="mb-2">
              {data.qtd_fotos + 1} fotos · capa Pixar + páginas line art
            </Text>
            <Text size="caption" muted className="mb-5">
              PDF A4 300 DPI · pronto pra imprimir
            </Text>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onProcessar}
              disabled={!pronto || enviando}
            >
              {enviando
                ? "enviando..."
                : pronto
                ? "Montar meu livro"
                : "Adicione a capa"}
            </Button>
            <Text size="caption" muted className="mt-3 text-center">
              Pré-visualização gerada em ~1 min
            </Text>
          </Card>
        </aside>
      </div>

      {/* Footer fixo apenas no mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-sm border-t border-border-soft lg:hidden">
        <div className="max-w-md mx-auto px-6 py-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onProcessar}
            disabled={!pronto || enviando}
          >
            {enviando
              ? "enviando..."
              : pronto
              ? `Montar livro · ${fmtBRL(data.valor_centavos)}`
              : "Adicione a capa pra continuar"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function PhotoSlot({
  posicao,
  isCapa,
  uploading,
  thumb,
  uploaded,
  onPick,
  small,
  label,
}: {
  posicao: number;
  isCapa?: boolean;
  uploading?: boolean;
  thumb?: string;
  uploaded?: boolean;
  onPick: (file: File) => void;
  small?: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      onClick={() => ref.current?.click()}
      type="button"
      className={[
        "aspect-square relative w-full overflow-hidden rounded transition-all duration-150 active:opacity-80",
        "border",
        uploaded ? "border-charcoal" : "border-border-soft hover:border-border-strong",
        thumb ? "bg-charcoal-3" : "bg-cream",
      ].join(" ")}
    >
      {thumb && (
        <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {!thumb && !uploaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-charcoal-40">
          <span className={small ? "text-base" : "text-2xl"}>+</span>
          {isCapa && <span className="text-caption mt-2 text-muted">Adicionar capa</span>}
          {!isCapa && !small && <span className="text-caption mt-1 text-muted">{label || posicao}</span>}
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-cream/80 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-pill animate-spin" />
        </div>
      )}
      {uploaded && !thumb && (
        <div className="absolute inset-0 bg-charcoal-4 flex items-center justify-center text-charcoal text-xl">
          ✓
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
    </button>
  );
}
