# Checklist: Deploy em Produção (Vercel)

## Pré-requisitos

- [ ] Supabase migrado para sa-east-1 (veja `MIGRACAO_SUPABASE_SA_EAST_1.md`)
- [ ] Webhook testado em dev com ngrok (veja `TESTE_WEBHOOK_MERCADO_PAGO.md`)
- [ ] Todos os commits estão em `origin/main`
- [ ] Dev server testado localmente sem erros

## Passo 1: Configurar Variáveis no Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Projeto **oab-em-blocos** → **Settings** → **Environment Variables**
3. Adicione/atualize cada variável abaixo (copie do `.env.production.example`):

| Variável | Origem | Nota |
|----------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase (sa-east-1) | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Chave pública anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Chave de serviço (restrita) |
| `DATABASE_URL` | Supabase | Pooler (porta 6543) |
| `DATABASE_URL_DIRECT` | Supabase | Direct (porta 5432) — opcional pra scripts |
| `NEXT_PUBLIC_SITE_URL` | Seu domínio | `https://oab.app.br` |
| `MERCADO_PAGO_ACCESS_TOKEN` | MP Dashboard | Produção (APP_USR- prefix) |
| `MERCADO_PAGO_PUBLIC_KEY` | MP Dashboard | Produção (APP_USR- prefix) |
| `MERCADO_PAGO_WEBHOOK_SECRET` | MP Dashboard | Encontra em Webhooks |
| `RESEND_API_KEY` | Resend Dashboard | Chave de API |
| `RESEND_FROM` | Você | `noreply@oab.app.br` |

**Como encontrar cada uma:**

### Supabase (sa-east-1)
1. Acesse projeto em sa-east-1
2. **Settings** → **API**
3. Copie as URLs e chaves

### Mercado Pago (Produção)
1. Dashboard → **Suas Integrações** → App
2. **Credenciais de Produção** (não de teste!)
3. Copie access token e public key
4. **Webhooks** → Copie a chave secreta

### Resend
1. [resend.com/api-keys](https://resend.com/api-keys)
2. Copie a chave

## Passo 2: Registrar Webhook no Mercado Pago (Produção)

1. Acesse MP Dashboard → **Suas Integrações** → **Webhooks**
2. Clique **Agregar nuevo webhook** (ou edite existente)
3. **URL:** `https://oab.app.br/api/pagamento/webhook/mercado-pago`
4. **Eventos:** Selecione `payment`
5. Salve

MP vai testar a URL — deve receber `200 OK` se tudo está ok.

## Passo 3: Fazer Deploy

### Opção A: Via GitHub (Recomendado — automático)

```bash
# No seu PC, dentro do repo
git push origin main

# Vercel detecta push → redeploya automaticamente
```

### Opção B: Via Vercel CLI

```bash
# Instale se não tem: npm i -g vercel
vercel --prod
```

Espere ~3-5 minutos pelo build e deploy.

## Passo 4: Validar Deploy

1. Acesse **https://oab.app.br**
   - Landing deve carregar
   - Preço deve ser R$ 97

2. Acesse **https://oab.app.br/assinar**
   - Se não logado: redireciona `/cadastro?next=/assinar`
   - Se logado: exibe pricing + botão "Assinar agora"

3. Clique em "Assinar agora"
   - Deve redirecionar ao MP (produção)
   - Procure pela URL `checkout.mercadopago.com.br` (não sandbox)

4. Teste com cartão real OU peça ao MP um cartão de teste pra produção
   - Simule pagamento
   - Valide que webhook chega (MP dashboard → Webhooks → Eventos Recentes)
   - Confirme assinatura ativa em DB

5. Acesse **https://oab.app.br/trilha**
   - Se assinatura ativa: exibe trilha
   - Se não: redireciona `/assinar`

## Passo 5: Monitorar

### Logs em Tempo Real

```bash
# Via Vercel CLI
vercel logs --prod

# Ou via Dashboard: Deployments → [último] → Logs
```

### Webhook Events (MP Dashboard)

1. Dashboard MP → **Webhooks** → **Eventos Recentes**
2. Procure por requests pra sua URL
3. Se status 200: webhook chegou ok
4. Se 404/500: há um erro — verifique logs

### Banco (Supabase)

```sql
-- Verificar assinaturas ativas
SELECT user_id, status, fim FROM assinaturas 
WHERE status='ativo' AND fim > now() 
ORDER BY criado_em DESC LIMIT 10;

-- Verificar pagamentos
SELECT user_id, status, valor_centavos, criado_em FROM pagamentos 
ORDER BY criado_em DESC LIMIT 10;
```

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| "Variável não definida" em logs | Variável Vercel ausente | Adicione em Environment Variables |
| Webhook não chega | URL webhook incorreta no MP | Verifique: `https://oab.app.br/api/pagamento/webhook/mercado-pago` |
| Cartão recusado | Usando cartão de teste em produção | Use cartão real ou peça teste ao MP |
| Latência alta | Supabase ainda em us-east-1 | Confirme migração completou |
| Login não funciona | Supabase anon key inválida | Verifique NEXT_PUBLIC_SUPABASE_URL e KEY |

## Rollback (Se Algo Quebrar)

```bash
# Voltar pro commit anterior (se necessário)
git revert HEAD
git push origin main

# Vercel redeploya automaticamente
```

## Próximas Fases (Pós-Lançamento)

- [ ] Analytics (Vercel Analytics ou Plausible)
- [ ] Revisar os 125 blocos didáticos (associados)
- [ ] Revisar as 300 questões autorais
- [ ] Ingestão contínua de provas FGV (agent semanal)
- [ ] Suporte ao cliente (Slack, e-mail, chat)

---

**Status:** Pronto pra ir ao ar.
