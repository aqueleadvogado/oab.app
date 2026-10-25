"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { revisoes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { avaliar, proximaDueDate, type AvaliacaoRevisao } from "@/lib/revisao/sm2";

type Result = { ok: true } | { ok: false; erro: string };

export async function responderRevisao(
  revisaoId: string,
  avaliacao: AvaliacaoRevisao,
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Não autenticado." };

  const [atual] = await db
    .select()
    .from(revisoes)
    .where(and(eq(revisoes.id, revisaoId), eq(revisoes.userId, user.id)))
    .limit(1);
  if (!atual) return { ok: false, erro: "Revisão não encontrada." };

  const estado = avaliar(
    {
      fator: Number(atual.fator),
      intervaloDias: atual.intervaloDias,
      lapsos: atual.lapsos,
    },
    avaliacao,
  );

  await db
    .update(revisoes)
    .set({
      fator: estado.fator.toFixed(2),
      intervaloDias: estado.intervaloDias,
      lapsos: estado.lapsos,
      dueAt: proximaDueDate(estado.intervaloDias),
      ultimaRevisao: new Date(),
    })
    .where(eq(revisoes.id, revisaoId));

  revalidatePath("/revisao");
  revalidatePath("/trilha");
  return { ok: true };
}
