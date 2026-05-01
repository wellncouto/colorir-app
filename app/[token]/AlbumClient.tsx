"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const fmtBRL = (centavos: number) =>
  `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;

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

  // Polling enquanto processando
  useEffect(() => {
    if (data?.status === "PROCESSANDO") {
      const id = setInterval(fetchStatus, 4000);
      return () => clearInterval(id);
    }
  }, [data?.status, fetchStatus]);

  // localStorage: persiste nome + estilo
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
    // thumb local
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

  if (!data && !err)
    return (
      <main className="p-6 text-center text-gray-500">carregando...</main>
    );
  if (err && !data)
    return (
      <main className="p-6 text-center text-red-600">
        Erro: {err}
        <button
          className="block mx-auto mt-4 underline"
          onClick={() => {
            setErr(null);
            fetchStatus();
          }}
        >
          tentar de novo
        </button>
      </main>
    );
  if (!data) return null;

  // Estado: PAGO
  if (data.status === "PAGO") {
    return (
      <main className="min-h-dvh p-6 max-w-md mx-auto text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Tudo pago!</h1>
        <p className="text-gray-600 mb-6">
          Teu livro tá pronto pra imprimir, em alta qualidade.
        </p>
        <a
          href={`${API}/colorir/album/${token}/pdf-final`}
          className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-4 rounded-full mb-3"
        >
          📥 Baixar PDF (A4 300 DPI)
        </a>
      </main>
    );
  }

  // Estado: PREVIEW (aguardando PIX)
  if (data.status === "PREVIEW") {
    return (
      <main className="min-h-dvh p-6 max-w-md mx-auto">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">📖</div>
          <h1 className="text-2xl font-bold">Tá quase!</h1>
          <p className="text-gray-600 mt-1">
            Seu livro foi montado. Confere o preview abaixo.
          </p>
        </div>
        <iframe
          src={`${API}/colorir/album/${token}/preview`}
          className="w-full aspect-[210/297] rounded-xl border-2 border-gray-200 bg-white shadow"
        />
        <div className="mt-6 bg-white border-2 border-brand-100 rounded-2xl p-5">
          <p className="text-sm text-gray-600">Pra liberar a versão sem marca d&apos;água:</p>
          <p className="text-3xl font-bold text-brand-600 mt-1">
            {fmtBRL(data.valor_centavos)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Manda o PIX pelo WhatsApp e em segundos teu PDF clean é liberado aqui.
          </p>
          <a
            href="https://wa.me/5547991100824?text=Já%20fiz%20o%20pix%2C%20segue%20comprovante"
            className="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-full mt-4"
          >
            💬 Voltar ao WhatsApp pra pagar
          </a>
        </div>
      </main>
    );
  }

  // Estado: PROCESSANDO
  if (data.status === "PROCESSANDO") {
    const ok = data.fotos.filter((f) => f.status === "OK").length;
    const erro = data.fotos.filter((f) => f.status === "ERRO").length;
    const pct = Math.round(((ok + erro) / Math.max(1, data.fotos.length)) * 100);
    return (
      <main className="min-h-dvh p-6 max-w-md mx-auto text-center">
        <div className="text-5xl mb-3 animate-pulse">✨</div>
        <h1 className="text-2xl font-bold mb-1">Tô fazendo o teu livro</h1>
        <p className="text-gray-600 mb-6">
          A IA tá transformando tuas fotos em desenhos. Pode demorar 1-2 min.
        </p>
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {ok}/{data.fotos.length} prontas {erro > 0 && `(${erro} com erro)`}
          </p>
        </div>
      </main>
    );
  }

  // Estado: NOVO / AGUARDA_ENVIO — tela de upload
  const slots = Array.from({ length: data.qtd_fotos + 1 }, (_, i) => i); // 0 = capa, 1..N
  const completos = data.fotos.length;
  const pronto = completos >= 1; // mínimo capa

  return (
    <main className="min-h-dvh p-4 max-w-md mx-auto pb-32">
      <header className="text-center my-5">
        <div className="text-3xl mb-1">🎨</div>
        <h1 className="text-xl font-bold">Monta teu livro pra colorir</h1>
        <p className="text-sm text-gray-500 mt-1">
          {completos}/{data.qtd_fotos + 1} fotos enviadas
        </p>
      </header>

      {/* Capa em destaque */}
      <section className="mb-6">
        <h2 className="text-xs font-bold tracking-widest text-brand-700 mb-2">
          📷 CAPA (foto principal)
        </h2>
        <PhotoSlot
          posicao={0}
          isCapa
          uploading={uploading[0]}
          thumb={thumbs[0]}
          uploaded={data.fotos.some((f) => f.posicao === 0 && f.status === "UPLOADED")}
          onPick={(file) => onUpload(0, file)}
        />
      </section>

      {/* Nome */}
      <section className="mb-6">
        <label className="block text-xs font-bold tracking-widest text-brand-700 mb-2">
          ✏️ NOME (aparece grande na capa)
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value.slice(0, 30))}
          placeholder='Ex: "FAMÍLIA COUTO" ou "LIVRO DO GAEL"'
          maxLength={30}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-brand-400 focus:outline-none uppercase"
        />
      </section>

      {/* Estilo */}
      <section className="mb-6">
        <label className="block text-xs font-bold tracking-widest text-brand-700 mb-2">
          🎨 ESTILO DA CAPA
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { v: "familia", label: "Família", color: "bg-amber-100" },
              { v: "rosa", label: "Menina", color: "bg-pink-100" },
              { v: "azul", label: "Menino", color: "bg-blue-100" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              onClick={() => setEstilo(opt.v)}
              className={`${opt.color} border-2 ${
                estilo === opt.v ? "border-brand-500" : "border-transparent"
              } rounded-xl py-3 text-sm font-semibold`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Páginas */}
      <section>
        <h2 className="text-xs font-bold tracking-widest text-brand-700 mb-2">
          📷 PÁGINAS DO LIVRO ({data.qtd_fotos} fotos)
        </h2>
        <div className="grid grid-cols-3 gap-2">
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
        <p className="text-sm text-red-600 mt-4 text-center">{err}</p>
      )}

      {/* Footer fixo: Enviar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={onProcessar}
            disabled={!pronto || enviando}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full text-base transition"
          >
            {enviando
              ? "enviando..."
              : pronto
              ? `✨ Montar meu livro (${fmtBRL(data.valor_centavos)})`
              : "Adiciona pelo menos a capa pra continuar"}
          </button>
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
  const sz = isCapa ? "aspect-square" : "aspect-square";
  const placeholder = isCapa
    ? "+ Adicionar capa"
    : `+ ${label || posicao}`;
  return (
    <button
      onClick={() => ref.current?.click()}
      className={`${sz} relative w-full bg-brand-50 border-2 border-dashed ${
        uploaded ? "border-brand-400" : "border-brand-200"
      } rounded-xl overflow-hidden flex items-center justify-center text-brand-600 ${
        small ? "text-xs" : "text-sm font-semibold"
      } active:scale-95 transition`}
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!thumb && !uploaded && (
        <span className={isCapa ? "text-base" : "text-xs"}>{placeholder}</span>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {uploaded && !thumb && (
        <div className="absolute inset-0 bg-brand-100 flex items-center justify-center text-brand-600 text-2xl">
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
