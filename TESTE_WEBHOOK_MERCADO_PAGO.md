# Teste E2E do Checkout com Mercado Pago + Webhook

**Objetivo:** Validar que o fluxo completo de pagamento funciona: cliente clica em "Assinar" → redireciona ao MP → simula pagamento aprovado → webhook atualiza assinatura no banco.

## Pré-requisitos

- Dev server rodando: `npm run dev` (porta 3001)
- Credenciais de teste do MP no `.env.local`:
  - `MERCADO_PAGO_ACCESS_TOKEN_TESTE`
  - `MERCADO_PAGO_PUBLIC_KEY_TESTE`
  - `MERCADO_PAGO_WEBHOOK_SECRET`
- Banco de dados funcionando (Supabase)

## Passo 1: Expor localhost com ngrok

O Mercado Pago não consegue bater em `localhost:3001` de sua máquina. Usamos **ngrok** pra criar um tunel.

```bash
# Se não tem ngrok instalado:
# Windows: baixar em https://ngrok.com/download
# Ou via npm/chocolatey: choco install ngrok

ngrok http 3001
```

Você verá algo como:
```
Session Status                online
Version                       3.x.x
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3001

Connections                   ttl    opn    rt1    rt5    rt10   time
                              0      0      0.0s   0.0s   0.0s   0
```

**Copie a URL do Forwarding:** `https://abc123def456.ngrok.io`

## Passo 2: Configurar variável de ambiente

Abra `.env.local` e adicione:
```
NEXT_PUBLIC_SITE_URL=https://abc123def456.ngrok.io
```

Recarregue o dev server (`Ctrl+C` e `npm run dev` novamente).

## Passo 3: Configurar webhook no Mercado Pago

1. Acesse [dashboard.mercadopago.com.br](https://dashboard.mercadopago.com.br)
2. Menu: **Sua integração** → **Webhooks**
3. Clique **Agregar novo webhook** (ou edite o existente)
4. **URL:** `https://abc123def456.ngrok.io/api/pagamento/webhook/mercado-pago`
5. **Eventos:** Selecione `payment` (a que nos interessa)
6. Salve

O MP vai testar o endpoint imediatamente — se receber um `200 OK` na rota `GET`, está ok.

## Passo 4: Simular pagamento

1. No navegador, acesse **https://abc123def456.ngrok.io/assinar** (sim, HTTPS + via ngrok)
2. Clique no botão **Assinar agora**
3. Você será redirecionado ao MP (ambiente de TESTE)
4. **Simule um pagamento aprovado** com cartão de teste:
   - **Número:** `4111 1111 1111 1111` (ou `5031 4332 1540 6351`)
   - **Validade:** Qualquer mês/ano futuro (ex: `12/25`)
   - **CVV:** Qualquer 3 dígitos (ex: `123`)
   - **Titular:** Qualquer nome
5. Clique **Pagar**

## Passo 5: Validar webhook

### No terminal ngrok:

Você verá no terminal do ngrok:
```
POST /api/pagamento/webhook/mercado-pago 200 OK [timestamp]
```

### No console do dev server:

Procure por logs do webhook. Se configurou tudo, verá algo como:
```
[MP webhook] payment received: <payment-id>
[MP webhook] assinatura ativada: <assinatura-id>, fim: 2027-10-26
[Resend] e-mail de boas-vindas enviado para <email>
```

### No banco (SQL):

Rode uma query pra confirmar:
```sql
SELECT id, status, inicio, fim FROM assinaturas 
WHERE user_id = '<seu-user-id>' 
ORDER BY criado_em DESC LIMIT 1;
```

Esperado:
```
id           | status | inicio              | fim
<assin-id>   | ativo  | 2024-10-26 ...      | 2025-10-26 ...
```

## Passo 6: Validar fluxo de redireção

Após o MP processar o pagamento, você deve ser redirecionado para:
- **Sucesso:** `https://abc123def456.ngrok.io/assinatura/sucesso`
- **Falha:** `https://abc123def456.ngrok.io/assinatura/falha`
- **Pendente (Pix):** `https://abc123def456.ngrok.io/assinatura/pendente`

## Passo 7: Testar acesso a /trilha

Após assinatura ativa:
1. Acesse **https://abc123def456.ngrok.io/trilha**
2. Deve exibir a trilha de estudos (não redirecionar para `/assinar`)

Se não logado:
1. Acesse **https://abc123def456.ngrok.io/trilha**
2. Deve redirecionar para `/cadastro?next=/trilha`

## Troubleshooting

### Webhook não chega

**Sintoma:** Pagamento é processado no MP, mas seu banco não ativa a assinatura.

**Causa comum:** Firewall/proxy bloqueando POST do MP.

**Solução:**
1. Confirme que ngrok está rodando e a URL está em `.env.local`
2. No painel do MP, vá em **Webhooks** e procure por **Eventos Recentes** — se o MP tentou enviar (status 404/500), há um problema na rota
3. Verifique os logs do dev server (ngrok bridge mostra `POST /api/... 404` ou erro)
4. Confirme que a assinatura HMAC está correta (header `x-signature`)

### Cartão recusado no MP

Use um dos cartões de teste do MP. Se mesmo assim falhar:
- **Cartão 4111 1111 1111 1111:** Deve ser aceito em qualquer situação
- **Cartão 5031 4332 1540 6351:** Alternativa (aceitação)

### Validade expirada

Cartões de teste não expiram, mas se colocou uma data antiga (ex: `01/20`), rejeitará.

## Próximos Passos

Quando validado em dev:
1. **Fazer commit** dos testes realizados
2. **Migrar Supabase para sa-east-1** (latência)
3. **Deploy em produção** (Vercel):
   - Configurar variáveis: `NEXT_PUBLIC_SITE_URL=https://oab.app.br`
   - Criar novo webhook no painel MP com URL de produção
   - Usar credenciais de produção (APP_USR-xxxxx)
4. **Teste final em produção** com cartão real (ou pedido de teste via MP)

## Documentação Referência

- [Mercado Pago Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [MP Payment Status](https://www.mercadopago.com.br/developers/pt/reference/payments)
- [ngrok Docs](https://ngrok.com/docs)
