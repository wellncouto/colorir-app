export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6 text-center">
      <div className="max-w-sm">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="text-2xl font-bold mb-2">Meu Livro Pra Colorir</h1>
        <p className="text-gray-600 mb-6">
          Acesso pelo WhatsApp. Procure o link único enviado pra você.
        </p>
        <a
          href="https://wa.me/5547991100824?text=Quero%20meu%20livro%20pra%20colorir"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-full"
        >
          Falar no WhatsApp
        </a>
      </div>
    </main>
  );
}
