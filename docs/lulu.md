# Integração Lulu – Editora Cross

## Configuração
1. Defina as variáveis de ambiente (`.env.local`):
   ```
   LULU_ENV=sandbox
   LULU_CLIENT_KEY=... (client credentials)
   LULU_CLIENT_SECRET=...
   LULU_WEBHOOK_SECRET=...
   LULU_BASE_URL_SANDBOX=https://api.sandbox.lulu.com
   LULU_BASE_URL_PROD=https://api.lulu.com
   LULU_OAUTH_TOKEN_URL=https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token
   ```
2. As rotas são todas server-side em `/app/api/lulu/*`.
3. A autenticação usa OAuth2 client_credentials, com cache em memória (`getAccessToken`).

## Endpoints Implementados
- `POST /api/lulu/shipping-options`
- `POST /api/lulu/print-job-cost`
- `POST /api/lulu/print-jobs`
- `GET /api/lulu/print-jobs`
- `GET /api/lulu/print-jobs/:id`
- `GET /api/lulu/print-jobs/:id/status`
- `GET /api/lulu/print-jobs/:id/costs`
- `POST /api/lulu/validate-interior`
- `GET /api/lulu/validate-interior/:id`
- `POST /api/lulu/validate-cover`
- `GET /api/lulu/validate-cover/:id`
- Webhooks:
  - `POST /api/lulu/webhooks`
  - `POST /api/lulu/webhooks/subscribe`
  - `GET /api/lulu/webhooks/submissions`

Todas as chamadas utilizam `luluFetch`, que já injeta o token Bearer e normaliza erros.

## Testes Sandbox
Arquivo `scripts/lulu-tests.http` possui exemplos cURL dos fluxos:
1. Shipping options
2. Cálculo de custos
3. Criação de Print Job
4. Consultas de status/custos
5. Simulação de webhook com assinatura HMAC

Certifique-se de usar arquivos hospedados publicamente para `source_url` nas normalizações.

## Webhooks
- Envie webhook para `/api/lulu/webhooks` com header `Lulu-HMAC-SHA256` (hex).
- A chave deve ser igual a `LULU_WEBHOOK_SECRET`.
- Eventos são persistidos em `data/webhooks/`.

## Rate limit
Leve rate limit por IP (aprox. 40~100 req/min dependendo da rota).
