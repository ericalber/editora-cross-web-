# Editora Cross – Portal Institucional

Portal Next.js para lançamento da Editora Cross com catálogo de livros, newsroom editorial e novo fluxo de e-commerce (carrinho + Stripe).

## Requisitos
- Node.js 18+
- npm 9+

## Instalação e execução
```bash
npm install
npm run dev
```
Aplicação disponível em `http://localhost:3000`.

### Build e lint
```bash
npm run build
npm run lint
```

## Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | sim | Chave secreta da conta Stripe |
| `STRIPE_WEBHOOK_SECRET` | sim | Assinatura do webhook configurado para `/api/checkout/webhook` |
| `NEXT_PUBLIC_BASE_URL` | sim | URL pública do site (ex.: `http://localhost:3000`) |
| `NEXT_PUBLIC_CURRENCY` | opcional | Moeda (ex.: `usd` ou `brl`) |
| `PAYPAL_CLIENT_ID` | opcional | Habilita toggle de pagamento PayPal |
| `PAYPAL_SECRET` | opcional | Necessário para concluir integração PayPal no backend |

## Conteúdo editorial
- Notícias em Markdown: `conteudo/noticias/{slug}.md` (frontmatter com título, data, categoria, seoDescription).
- Catálogo: `conteudo/livros.json` (sinopses ~150 palavras, dados comerciais) e `conteudo/autores.json` (mini-bios + curiosidades).

## E-commerce
- `src/commerce/CartContext.tsx`: contexto global com persistência via `localStorage`.
- Adição ao carrinho via `<AddToCartButton />` (cards e páginas de detalhe).
- Páginas `/carrinho`, `/checkout`, `/checkout/sucesso`, `/checkout/cancelado`.
- API Stripe: `/api/checkout/create-session` e `/api/checkout/webhook` registrando pedidos em `data/orders/`.

### Stripe
1. Criar webhook no painel apontando para `/api/checkout/webhook` e copiar assinatura (`STRIPE_WEBHOOK_SECRET`).
2. Atualizar `NEXT_PUBLIC_BASE_URL` conforme domínio de produção.
3. Testar comando `npm run dev`, adicionar item ao carrinho e finalizar checkout com uma chave de teste.

### PayPal
Toggle disponível em `/checkout`. A integração completa deve ser implementada quando `PAYPAL_CLIENT_ID`/`PAYPAL_SECRET` estiverem ativos.

## Auditoria
Relatórios simulados de Lighthouse: ver pasta `audit/perf`. Status geral, checklist MUST e gaps estão em `audit/STATUS_LANCAMENTO.md`.

## Estrutura principal
```
app/
  carrinho/
  checkout/
  noticias/
  livros/
  autores/
components/
  AddToCartButton.tsx
  CartIcon.tsx
conteudo/
  noticias/*.md
  livros.json
  autores.json
src/
  commerce/CartContext.tsx
```

## Próximos passos sugeridos
- Substituir placeholders visuais (`public/placeholders/*`) por capas reais.
- Completar páginas institucionais (`/contato`, `/sobre`).
- Adicionar testes automatizados para o fluxo de carrinho/checkout.
