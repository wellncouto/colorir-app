# Colorir App

Frontend Next.js do produto **Álbum Pra Colorir Personalizado**.

## Estrutura
- `/` — landing simples redireciona pro WhatsApp
- `/[token]` — página principal: upload de fotos, escolha de capa+nome, preview do PDF, fluxo de pagamento

## Estados
- **NOVO / AGUARDA_ENVIO** — tela de upload (capa em destaque + grid de páginas + nome + estilo)
- **PROCESSANDO** — barra de progresso com polling a cada 4s
- **PREVIEW** — iframe do PDF preview com watermark + CTA pra pagar PIX no WhatsApp
- **PAGO** — botão de download do PDF final (A4 300 DPI)

## Backend
Backend FastAPI em `restore-proxy` na rota `/colorir/*`. URL via `NEXT_PUBLIC_API_URL` no env.

## Run local
```bash
npm install
npm run dev
# abre http://localhost:3001/{token}
```

## Deploy Easypanel
- Service tipo App → Dockerfile
- Porta interna 3001
- Env: `NEXT_PUBLIC_API_URL=https://empresarial-restore-proxy.y3mi4h.easypanel.host`
- Domínio sugerido: `colorir.tudominio.com.br`

## Próximas iterações (não bloqueia lançamento)
- [ ] Tela "Meus Livros" (histórico de PDFs pagos via `/colorir/historico/{phone}`)
- [ ] OTP login via número de telefone
- [ ] Webhook auto pra polling cair (server-sent events)
- [ ] Templates de capa com mais variações de cor
