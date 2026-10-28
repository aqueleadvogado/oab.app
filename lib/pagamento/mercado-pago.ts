import "server-only";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Resolve credenciais por ambiente.
 * - production → APP_USR (cobrança real)
 * - dev/preview → TEST (sem risco)
 *
 * Fallback: se TESTE não existir em dev, usa produção com um aviso bem alto no console.
 */
function resolverCredenciais() {
  const emProducao = process.env.NODE_ENV === "production";

  if (emProducao) {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY;
    if (!token || !publicKey) {
      throw new Error(
        "MERCADO_PAGO_ACCESS_TOKEN e MERCADO_PAGO_PUBLIC_KEY precisam estar no ambiente de produção.",
      );
    }
    return { token, publicKey, modo: "producao" as const };
  }

  const tokenTeste = process.env.MERCADO_PAGO_ACCESS_TOKEN_TESTE;
  const publicTeste = process.env.MERCADO_PAGO_PUBLIC_KEY_TESTE;
  if (tokenTeste && publicTeste) {
    return { token: tokenTeste, publicKey: publicTeste, modo: "teste" as const };
  }

  // Último recurso: produção em dev. Alerta ruidoso.
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const publicKey = process.env.MERCADO_PAGO_PUBLIC_KEY;
  if (!token || !publicKey) {
    throw new Error(
      "Nenhuma credencial do Mercado Pago encontrada. Preencha MERCADO_PAGO_ACCESS_TOKEN(_TESTE) e MERCADO_PAGO_PUBLIC_KEY(_TESTE) no .env.local.",
    );
  }
  console.warn(
    "[MP] ATENÇÃO: usando credenciais de PRODUÇÃO em ambiente não-produção. Pagamentos serão REAIS.",
  );
  return { token, publicKey, modo: "producao" as const };
}

let clientCache: MercadoPagoConfig | null = null;

function getClient() {
  if (clientCache) return clientCache;
  const { token } = resolverCredenciais();
  clientCache = new MercadoPagoConfig({
    accessToken: token,
    options: { timeout: 10_000 },
  });
  return clientCache;
}

export function getPublicKey() {
  return resolverCredenciais().publicKey;
}

export function getModo() {
  return resolverCredenciais().modo;
}

/**
 * Cria preferência de Checkout Pro para pagamento único.
 * Retorna init_point (URL para redirecionar o aluno).
 */
export async function criarPreferenciaCheckoutPro(input: {
  assinaturaId: string;
  userId: string;
  email: string;
  nome: string | null;
  valorCentavos: number;
  tituloPlano: string;
  urlBase: string; // ex: https://oab.app.br — para montar back_urls e notification_url
}) {
  const client = getClient();
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: `plano-anual-${input.assinaturaId}`,
          title: input.tituloPlano,
          quantity: 1,
          unit_price: input.valorCentavos / 100,
          currency_id: "BRL",
          category_id: "learnings", // categoria MP mais próxima de educação
        },
      ],
      payer: {
        email: input.email,
        name: input.nome ?? undefined,
      },
      external_reference: input.assinaturaId,
      metadata: {
        user_id: input.userId,
        assinatura_id: input.assinaturaId,
      },
      back_urls: {
        success: `${input.urlBase}/assinatura/sucesso`,
        failure: `${input.urlBase}/assinatura/falha`,
        pending: `${input.urlBase}/assinatura/pendente`,
      },
      auto_return: "approved",
      notification_url: `${input.urlBase}/api/pagamento/webhook/mercado-pago`,
      statement_descriptor: "OAB EM BLOCOS",
      // Sem recorrência — pagamento único anual
    },
  });

  if (!result.id || !result.init_point) {
    throw new Error("Mercado Pago não retornou init_point.");
  }

  return {
    preferenceId: result.id,
    redirectUrl: result.init_point,
  };
}

/**
 * Consulta um pagamento pelo id (vindo do webhook).
 */
export async function consultarPagamento(paymentId: string) {
  const client = getClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

/**
 * Valida assinatura HMAC do webhook do Mercado Pago.
 * MP manda headers:
 *   x-signature: ts=1700000000,v1=abcdef...
 *   x-request-id: <uuid>
 * E o body contém data.id. Precisamos reconstruir o manifest:
 *   id:${data.id};request-id:${xRequestId};ts:${ts};
 * E calcular HMAC-SHA256 com MERCADO_PAGO_WEBHOOK_SECRET.
 *
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export function validarWebhookSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
}) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    // Em dev sem secret configurado — aceita (loga).
    if (process.env.NODE_ENV !== "production") {
      console.warn("[MP webhook] MERCADO_PAGO_WEBHOOK_SECRET ausente; pulando validação em dev.");
      return true;
    }
    throw new Error("MERCADO_PAGO_WEBHOOK_SECRET ausente em produção.");
  }

  if (!opts.xSignature || !opts.xRequestId) return false;

  const parts = opts.xSignature.split(",").reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${opts.dataId};request-id:${opts.xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(v1, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
