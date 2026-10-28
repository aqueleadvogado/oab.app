import { NextRequest, NextResponse } from "next/server";
import {
  consultarPagamento,
  validarWebhookSignature,
} from "@/lib/pagamento/mercado-pago";
import {
  getAssinaturaPorId,
  processarWebhookPagamento,
} from "@/lib/pagamento/queries";

export const dynamic = "force-dynamic";

/**
 * POST /api/pagamento/webhook/mercado-pago
 *
 * O MP manda notificações de "payment" sempre que o status muda.
 * Fluxo:
 *   1. Valida assinatura HMAC (header x-signature)
 *   2. Se type=payment, busca os dados completos do pagamento via API
 *   3. Resolve a assinatura via external_reference
 *   4. Grava pagamento + ativa assinatura se approved
 *
 * Idempotente: o índice único (provedor, provedor_payment_id) em pagamentos
 * evita duplicação se o MP mandar a mesma notificação duas vezes.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    type?: string;
    action?: string;
    data?: { id?: string };
  };

  // MP pode mandar outros tipos (merchant_order, subscription...). Só tratamos payment.
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true, ignorado: body.type ?? "sem_type" });
  }

  const paymentId = String(body.data.id);
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  const assinaturaOk = validarWebhookSignature({
    xSignature,
    xRequestId,
    dataId: paymentId,
  });

  if (!assinaturaOk) {
    console.warn("[MP webhook] assinatura inválida", { paymentId, xRequestId });
    return NextResponse.json({ erro: "assinatura_invalida" }, { status: 401 });
  }

  // Busca o pagamento completo no MP (não confia no body do webhook).
  let pagamento;
  try {
    pagamento = await consultarPagamento(paymentId);
  } catch (err) {
    console.error("[MP webhook] falha ao consultar pagamento", paymentId, err);
    return NextResponse.json({ erro: "consulta_falhou" }, { status: 500 });
  }

  const assinaturaId = pagamento.external_reference;
  if (!assinaturaId) {
    console.warn("[MP webhook] pagamento sem external_reference", paymentId);
    return NextResponse.json({ erro: "sem_external_reference" }, { status: 400 });
  }

  const assinatura = await getAssinaturaPorId(assinaturaId);
  if (!assinatura) {
    console.warn("[MP webhook] assinatura não encontrada", assinaturaId);
    return NextResponse.json({ erro: "assinatura_nao_encontrada" }, { status: 404 });
  }

  const metodo =
    pagamento.payment_type_id === "credit_card" ||
    pagamento.payment_type_id === "debit_card"
      ? "cartao"
      : pagamento.payment_method_id === "pix"
      ? "pix"
      : "boleto";

  try {
    const { statusPagamento } = await processarWebhookPagamento({
      assinaturaId,
      userId: assinatura.userId,
      valorCentavos: Math.round((pagamento.transaction_amount ?? 0) * 100),
      metodo,
      statusMp: pagamento.status ?? "pending",
      provedor: "mercado_pago",
      provedorPaymentId: paymentId,
      webhookPayload: pagamento,
    });

    return NextResponse.json({ ok: true, status: statusPagamento });
  } catch (err) {
    console.error("[MP webhook] falha ao processar", err);
    return NextResponse.json({ erro: "processamento_falhou" }, { status: 500 });
  }
}

// MP às vezes faz GET pra validar que o endpoint existe.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "mercado-pago-webhook" });
}
