import "server-only";
import { db } from "@/lib/db";
import { planos, assinaturas, pagamentos } from "@/lib/db/schema";
import { and, desc, eq, gt } from "drizzle-orm";

export async function getPlanoPorSlug(slug: string) {
  const [p] = await db
    .select()
    .from(planos)
    .where(and(eq(planos.slug, slug), eq(planos.ativo, true)))
    .limit(1);
  return p ?? null;
}

/**
 * Retorna a assinatura ATIVA (não expirada) do usuário, se houver.
 */
export async function getAssinaturaAtiva(userId: string) {
  const agora = new Date();
  const [a] = await db
    .select()
    .from(assinaturas)
    .where(
      and(
        eq(assinaturas.userId, userId),
        eq(assinaturas.status, "ativo"),
        gt(assinaturas.fim, agora),
      ),
    )
    .orderBy(desc(assinaturas.fim))
    .limit(1);
  return a ?? null;
}

/**
 * Cria uma assinatura em status "aguardando_pagamento" antes de redirecionar para o checkout.
 * O webhook posterior preenche inicio/fim/status=ativo.
 */
export async function criarAssinaturaPendente(input: {
  userId: string;
  planoId: string;
  provedor: "mercado_pago" | "asaas";
}) {
  const [criada] = await db
    .insert(assinaturas)
    .values({
      userId: input.userId,
      planoId: input.planoId,
      provedor: input.provedor,
      status: "aguardando_pagamento",
    })
    .returning();
  return criada;
}

export async function getAssinaturaPorId(assinaturaId: string) {
  const [a] = await db
    .select()
    .from(assinaturas)
    .where(eq(assinaturas.id, assinaturaId))
    .limit(1);
  return a ?? null;
}

/**
 * Idempotente — grava o pagamento (uniq por provedor+paymentId) e, se aprovado,
 * ativa a assinatura com fim = agora + periodicidadeDias.
 */
export async function processarWebhookPagamento(input: {
  assinaturaId: string;
  userId: string;
  valorCentavos: number;
  metodo: "cartao" | "pix" | "boleto";
  statusMp: string; // "approved" | "pending" | "rejected" | ...
  provedor: "mercado_pago";
  provedorPaymentId: string;
  webhookPayload: unknown;
}) {
  const statusPagamento =
    input.statusMp === "approved"
      ? "aprovado"
      : input.statusMp === "rejected" || input.statusMp === "cancelled"
      ? "recusado"
      : input.statusMp === "refunded" || input.statusMp === "charged_back"
      ? "estornado"
      : "pendente";

  // Grava pagamento (idempotente pelo índice único provedor+payment_id)
  await db
    .insert(pagamentos)
    .values({
      assinaturaId: input.assinaturaId,
      userId: input.userId,
      valorCentavos: input.valorCentavos,
      metodo: input.metodo,
      status: statusPagamento,
      provedor: input.provedor,
      provedorPaymentId: input.provedorPaymentId,
      webhookPayload: input.webhookPayload as object,
    })
    .onConflictDoUpdate({
      target: [pagamentos.provedor, pagamentos.provedorPaymentId],
      set: {
        status: statusPagamento,
        webhookPayload: input.webhookPayload as object,
      },
    });

  // Se aprovado, ativa a assinatura
  if (statusPagamento === "aprovado") {
    const [plano] = await db
      .select()
      .from(planos)
      .innerJoin(assinaturas, eq(assinaturas.planoId, planos.id))
      .where(eq(assinaturas.id, input.assinaturaId))
      .limit(1);

    if (!plano) {
      throw new Error(`Plano da assinatura ${input.assinaturaId} não encontrado.`);
    }

    const inicio = new Date();
    const fim = new Date(inicio.getTime() + plano.planos.periodicidadeDias * 86_400_000);

    await db
      .update(assinaturas)
      .set({
        status: "ativo",
        inicio,
        fim,
        atualizadoEm: new Date(),
      })
      .where(eq(assinaturas.id, input.assinaturaId));
  }

  return { statusPagamento };
}
