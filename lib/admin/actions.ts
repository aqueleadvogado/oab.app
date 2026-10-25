"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { blocos, questoes, cartoes, auditoria } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { usuarioLogadoComPapel } from "@/lib/admin/auth";

type Result = { ok: true } | { ok: false; erro: string };

async function garantirAdmin() {
  const u = await usuarioLogadoComPapel("admin");
  if (!u) throw new Error("Precisa ser admin.");
  return u;
}

export async function aprovarBloco(blocoId: string): Promise<Result> {
  try {
    const u = await garantirAdmin();
    const [antes] = await db
      .select({ status: blocos.status })
      .from(blocos)
      .where(eq(blocos.id, blocoId))
      .limit(1);
    if (!antes) return { ok: false, erro: "Bloco não encontrado." };

    const agora = new Date();
    await db
      .update(blocos)
      .set({ status: "publicado", revisadoPor: u.id, dataRevisao: agora })
      .where(eq(blocos.id, blocoId));

    // Publica tambem as questoes e cartoes do bloco (que estavam em_revisao)
    await db.update(questoes).set({ status: "publicado" }).where(eq(questoes.blocoId, blocoId));
    await db.update(cartoes).set({ status: "publicado" }).where(eq(cartoes.blocoId, blocoId));

    await db.insert(auditoria).values({
      actorId: u.id,
      acao: "bloco.publicou",
      alvoTipo: "bloco",
      alvoId: blocoId,
      antes: { status: antes.status },
      depois: { status: "publicado" },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/blocos");
    revalidatePath(`/admin/blocos/${blocoId}`);
    revalidatePath("/trilha");
    return { ok: true };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "Erro desconhecido." };
  }
}

export async function reprovarBloco(blocoId: string, motivo?: string): Promise<Result> {
  try {
    const u = await garantirAdmin();
    const [antes] = await db
      .select({ status: blocos.status })
      .from(blocos)
      .where(eq(blocos.id, blocoId))
      .limit(1);
    if (!antes) return { ok: false, erro: "Bloco não encontrado." };

    await db
      .update(blocos)
      .set({ status: "rascunho" })
      .where(eq(blocos.id, blocoId));

    await db.insert(auditoria).values({
      actorId: u.id,
      acao: "bloco.reprovou",
      alvoTipo: "bloco",
      alvoId: blocoId,
      antes: { status: antes.status },
      depois: { status: "rascunho", motivo: motivo ?? null },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/blocos");
    revalidatePath(`/admin/blocos/${blocoId}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "Erro desconhecido." };
  }
}
