"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { questoes, respostas, revisoes, sessoes } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

type Result<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; erro: string };

/** Grava resposta de questão + agenda revisão se errou. */
export async function responderQuestao(
  questaoId: string,
  escolhida: string,
  tempoSegundos?: number,
): Promise<Result<{ acertou: boolean; correta: string; comentario: string | null }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Não autenticado." };

  const [q] = await db
    .select()
    .from(questoes)
    .where(eq(questoes.id, questaoId))
    .limit(1);
  if (!q) return { ok: false, erro: "Questão não encontrada." };

  const acertou = q.correta === escolhida;

  await db.insert(respostas).values({
    userId: user.id,
    questaoId: q.id,
    escolhida,
    acertou,
    tempoSegundos: tempoSegundos ?? null,
  });

  // Se errou, agenda a questão para revisão amanhã (SM-2 começa aqui com fator baixo).
  if (!acertou) {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    await db
      .insert(revisoes)
      .values({
        userId: user.id,
        questaoId: q.id,
        dueAt: amanha,
        intervaloDias: 1,
        fator: "1.80",
      })
      .onConflictDoNothing();
  }

  return {
    ok: true,
    data: { acertou, correta: q.correta, comentario: q.comentario ?? null },
  };
}

/** Marca bloco concluído: atualiza sessão do dia (contador). */
export async function concluirBloco(blocoId: string, minutos: number): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Não autenticado." };

  const data = hojeISO();

  await db
    .insert(sessoes)
    .values({ userId: user.id, data, blocosFeitos: 1, minutos })
    .onConflictDoUpdate({
      target: [sessoes.userId, sessoes.data],
      set: {
        blocosFeitos: sql`${sessoes.blocosFeitos} + 1`,
        minutos: sql`${sessoes.minutos} + ${minutos}`,
      },
    });

  revalidatePath("/trilha");
  revalidatePath("/rotina");
  revalidatePath(`/estudo/${blocoId}`);
  return { ok: true };
}
