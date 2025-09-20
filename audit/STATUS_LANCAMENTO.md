# Status de Lançamento – Editora Cross

## Mapa de Rotas Ativas
- `/` – Home com slider, destaques, carrosséis de produtos e autores
- `/noticias` + `/noticias/[slug]` – Listagem paginada e artigos completos (Markdown convertido)
- `/livros` + `/livros/[slug]` – Catálogo filtrável e páginas de detalhe com CTA dupla
- `/autores` + `/autores/[slug]` – Grade de autores fictícios e perfis com curiosidades
- `/carrinho` – Lista editável com subtotal e CTA Stripe/WhatsApp
- `/checkout` – Resumo e chamada para Stripe + placeholder PayPal
- `/checkout/sucesso` e `/checkout/cancelado` – Estados pós-checkout
- Rotas faltantes vinculadas ao menu/rodapé: `/contato`, `/sobre`

## Quadro "PRONTO vs PENDENTE"
| Item | Status | Observações |
| --- | --- | --- |
| Estrutura de rotas públicas | PRONTO | Fluxo completo até checkout/sucesso; rotas estáticas + e-commerce |
| Conteúdo editorial (12 notícias) | PRONTO | Markdown 500–700 palavras com frontmatter e SEO description |
| Catálogo (livros/autores) | PRONTO | JSON estruturado, placeholders criados, cards atualizados |
| Carrinho + localStorage | PRONTO | Contexto global, AddToCart, badge no header, esvaziamento no sucesso |
| Checkout Stripe | PENDENTE | Rotas API prontas; requer `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL` |
| Webhook + log de pedidos | PENDENTE | Persiste em `/data/orders`, mas depende da configuração Stripe real |
| Integração PayPal | PENDENTE | Toggle disponível, implementação aguardando `PAYPAL_CLIENT_ID`/`PAYPAL_SECRET` |
| SEO técnico | PENDENTE | Falta canonical/tag por página, sitemap.xml, robots.txt, metas exclusivas |
| Acessibilidade | EM PROGRESSO | Headings consistentes; falta controle de autoplay no slider e foco visível em alguns botões |
| Performance | PENDENTE | Lighthouse não executado (ver relatórios simulados) – requer build e dependências |

## Top 10 Ações MUST para ir ao ar
1. Provisionar chaves Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_CURRENCY`) e validar checkout real.
2. Configurar endpoint webhook no painel Stripe apontando para `/api/checkout/webhook` e testar gravação em `/data/orders`.
3. Implementar integração PayPal ou ocultar o toggle até que `PAYPAL_CLIENT_ID`/`PAYPAL_SECRET` estejam ativos.
4. Criar páginas de conteúdo para `/contato` e `/sobre`, alinhando com links do header/footer.
5. Gerar `sitemap.xml` e `robots.txt`; definir canonical/meta description específicas por página com `next-seo`.
6. Substituir placeholders (`/next.svg`, `/public/placeholders/*.png`) por artes reais otimizadas e com `alt` descritivo.
7. Executar Lighthouse (desktop/mobile) e ajustes de performance (imagem hero responsiva, lazy-loading em carrosséis).
8. Revisar acessibilidade: adicionar controle de pausa no slider, garantir foco visível e `aria-label` nos botões dinâmicos.
9. Documentar passo a passo de configuração do checkout no README (ambiente `.env.example` incluído).
10. Rodar `npm install`, `npm run build`/`lint` em ambiente CI e configurar testes automatizados mínimos para o fluxo de carrinho.

## Relatórios de Performance
- `/audit/perf/home-lighthouse.html` – Execução simulada (dependências ausentes)
- `/audit/perf/home-lighthouse.json`
- `/audit/perf/noticias-lighthouse.html`
- `/audit/perf/noticias-lighthouse.json`
- `/audit/perf/livros-lighthouse.html`
- `/audit/perf/livros-lighthouse.json`

## Notas adicionais (SEO, A11y, Responsividade)
- SEO: Título e descrição global únicos; faltam metas individuais, canonical, OG tags, sitemap/robots.
- Imagens: diversos placeholders (`next.svg`) comprometem credibilidade e alt text genérico.
- Acessibilidade: Slider autoplay sem controle; botões +/− no carrinho usam símbolo unicode – considerar `aria-label` (já aplicado) e foco visível com `:focus-visible`.
- Responsividade: Grades usam Tailwind responsivo; verificar espaçamento no card triplo (`ProductsCarousel`) em telas <360px.
- Build/Testes: `npm install` e `npm run lint` falharam aqui por ausência de dependências; necessário validar em ambiente com rede liberada.
