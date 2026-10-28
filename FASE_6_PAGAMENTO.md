# Fase 6 — Pagamento com Mercado Pago (Funcional)

**Status:** ✅ Implementado  
**Data:** 2026-10-27 (Opus) + 2026-10-27 (Haiku)  
**Commits:** `b4919f9` ... `a1e94ab`

---

## O que temos

### ✅ Backend

- **Mercado Pago SDK**: `lib/pagamento/mercado-pago.ts` (Checkout Pro, HMAC webhook validation)
- **DB Queries**: `lib/pagamento/queries.ts` (criar/ativar assinatura, processar webhook)
- **Resend E-mail**: `lib/pagamento/email.ts` (boas-vindas pós-pagamento)
- **Route Handlers**: `/api/pagamento/checkout` (POST autenticado), `/api/pagamento/webhook/mercado-pago` (público)
- **Plano no banco**: `plano "anual"` R$ 97/ano (365 dias) — rodar `npm run db:seed-plano` uma vez

### ✅ Frontend

- **Página `/assinar`**: Pricing R$ 97, botão de checkout (client component)
- **Redirecionamentos pós-pagamento**: `/assinatura/{sucesso,falha,pendente}`
- **Status na conta**: `/conta` mostra "Ativa até 26/10/2027" ou "Ver plano R$ 97/ano"
- **Landing atualizada**: "/" com CTA "Começar agora — R$ 97 por ano"

### ✅ Segurança

- **Middleware de gating**: `proxy.ts` bloqueia `/trilha`, `/estudo`, `/revisao`, etc para quem não tem assinatura ativa
- **Autenticação**: Supabase + Drizzle + DB queries
- **Webhook HMAC**: Valida assinatura via `x-signature` header (timing-safe)
- **Credenciais por ambiente**: `TESTE` em dev, `APP_USR` em produção

---

## Próximos Passos Pra Lançar

### 1. Testar o fluxo completo (20 min)

Leia: **`TESTE_WEBHOOK_MERCADO_PAGO.md`**

Rápido resumo:
```bash
# Terminal 1: Dev server (se não está rodando)
npm run dev  # Porta 3001

# Terminal 2: Expor localhost
ngrok http 3001

# Terminal 3: Copiar a URL ngrok pra .env.local
NEXT_PUBLIC_SITE_URL=https://abc123def456.ngrok.io

# Recarregar dev server (Ctrl+C, npm run dev)
# Acesse http://localhost:3001/assinar (SIM, http, não https)
# Clique "Assinar agora"
# Simule pagamento com cartão teste 4111 1111 1111 1111
# Valide que webhook chega + assinatura ativa no banco
```

### 2. Migração Supabase sa-east-1 (30 min)

Leia: **`MIGRACAO_SUPABASE_SA_EAST_1.md`**

Isso reduz latência de ~150ms para ~20ms. **Crítico antes de lançamento.**

```bash
# Após migrado:
# 1. Atualize .env.local com novas URLs
# 2. npm run db:studio (valide conexão)
# 3. npm run db:seed (valide dados)
# 4. Deploy Vercel (recarrega variáveis)
```

### 3. Configurar Vercel em produção (15 min)

1. **Variáveis de ambiente** (Vercel → Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL=https://oab.app.br`
   - `DATABASE_URL=postgresql://...` (sa-east-1)
   - `MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...` (produção)
   - `MERCADO_PAGO_PUBLIC_KEY=APP_USR-...` (produção)
   - `MERCADO_PAGO_WEBHOOK_SECRET=...` (produção)
   - `RESEND_API_KEY=...` (mesmo de antes)
   - `RESEND_FROM=noreply@oab.app.br`

2. **Webhook no painel MP** (produção):
   - URL: `https://oab.app.br/api/pagamento/webhook/mercado-pago`
   - Eventos: `payment`

3. **Deploy**: `git push origin main` → Vercel redeploya automaticamente

### 4. Teste em produção (5 min)

1. Acesse `https://oab.app.br/assinar`
2. Clique "Assinar agora"
3. Use **cartão real** OU **solicite teste ao MP** (eles fornecem cartão de teste pra produção)
4. Confirme: webhook chega, assinatura ativa, e-mail enviado

---

## Stack Completo

| Camada | Tecnologia | Detalhes |
|--------|-----------|----------|
| **Checkout** | Mercado Pago Checkout Pro | Redireciona pra `https://checkout.mercadopago.com.br/...` |
| **Pagamento** | MP SDK v3 | Cria preferência + consulta status |
| **Autenticação** | Supabase | Sessão via cookies |
| **Banco** | Supabase + Drizzle | Tabelas: `planos`, `assinaturas`, `pagamentos` |
| **E-mail** | Resend | HTML template boas-vindas |
| **Gating** | Middleware Next.js | Bloqueia rotas protegidas se sem assinatura |
| **Staging** | Mercado Pago Teste | `TESTE-` prefix em dev |
| **Produção** | Mercado Pago Produção | `APP_USR-` prefix |

---

## Esquema de Dados

### Planos
```
id: uuid
slug: "anual"
nome: "Assinatura anual"
preco_centavos: 9700 (R$ 97,00)
periodicidade_dias: 365
```

### Assinaturas
```
id: uuid
user_id: uuid
plano_id: uuid
provedor: "mercado_pago"
status: "ativo" | "aguardando_pagamento" | "cancelado" | ...
inicio: timestamp
fim: timestamp (inicio + 365 dias)
```

### Pagamentos
```
id: uuid
assinatura_id: uuid
user_id: uuid
valor_centavos: 9700
metodo: "cartao" | "pix" | "boleto"
status: "aprovado" | "pendente" | "recusado" | "estornado"
provedor_payment_id: "12345678" (ID do MP)
webhook_payload: jsonb (full response MP)
```

---

## Fluxo Completo

```
1. Usuário logado clica "/assinar" → "Assinar agora"
   ↓
2. POST /api/pagamento/checkout
   - Autenticação via Supabase
   - Cria assinatura em DB (status=aguardando_pagamento)
   - Chama MP SDK → cria preferência
   - Retorna redirectUrl: https://checkout.mercadopago.com.br/...
   ↓
3. Navegador redireciona para checkout MP
   - Usuário preenche dados do cartão
   - Simula/realiza pagamento
   - MP retorna ao app: /assinatura/sucesso (ou /falha, /pendente)
   ↓
4. MP dispara webhook assincrono
   - POST /api/pagamento/webhook/mercado-pago
   - Valida assinatura HMAC
   - Consulta pagamento via MP SDK
   - Grava em DB (tabela pagamentos)
   - Se aprovado: atualiza assinatura (status=ativo, fim=+365d)
   - Dispara e-mail via Resend (fire-and-forget)
   ↓
5. Usuário acessa /trilha
   - Middleware verifica assinatura ativa
   - Se sim: exibe trilha
   - Se não: redireciona /assinar
```

---

## Detalhe Técnico: Por Que Checkout Pro e não Preapproval?

- **Checkout Pro**: Pagamento único anual (simples, no-churn, sem retry de cartão expirado)
- **Preapproval**: Cobrança recorrente automática (complexo: retry, pausas, cancelamento, taxas variáveis)

Para v1, Checkout Pro é o sweet spot. Preapproval fica como melhoria pós-lançamento.

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Webhook não chega em dev | Use ngrok + `NEXT_PUBLIC_SITE_URL` |
| "Plano não encontrado" em checkout | Rode `npm run db:seed-plano` |
| Cartão recusado | Use cartão teste `4111 1111 1111 1111` |
| E-mail não enviado | Verifica `RESEND_API_KEY` + `RESEND_FROM` |
| Latência alta | Migre Supabase para sa-east-1 |
| Middleware bloqueia acesso | Confirma assinatura ativa em DB |

---

## Commits Desta Fase

```
b4919f9 Fase 6.1 — Mercado Pago Checkout Pro + páginas de assinatura
6c9c2d5 Task #5: Middleware de gating por assinatura ativa
768a233 Task #6: E-mail de boas-vindas pós-pagamento (Resend)
3ef8b39 Task #3: Documentação de migração Supabase para sa-east-1
a1e94ab Task #7: Guia de teste e2e do checkout com ngrok + MP
```

---

## Próxima Fase (Fase 7)

- [ ] Revisão jurídica dos 125 blocos didáticos (associados do Evandro)
- [ ] Revisão das 300 questões autorais do DOCX
- [ ] Backfill histórico FGV provas 30-45 (OCR, classificação)
- [ ] Ingestão contínua de provas FGV novas (agent semanal)
- [ ] Painel admin otimizado pra revisão em bloco
- [ ] Analytics (Vercel Analytics ou Plausible)

---

**Status Geral:** Pronto pra lançar. Faltam testes finais + Supabase sa-east-1.
