"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { planoDoDia, profiles, sessoes } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { gerarPlanoDoDia, type EnergiaValor } from "@/lib/plano/gerador";

function hojeISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

type Result = { ok: true } | { ok: false; erro: string };

export async function fazerCheckIn(formData: FormData): Promise<Result> {
  const energia = String(formData.get("energia") ?? "") as EnergiaValor;
  if (!["verde", "amarelo", "vermelho"].includes(energia)) {
    return { ok: false, erro: "Energia inválida." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, erro: "Não autenticado." };

  // Carrega matérias prioritárias para o gerador.
  const [perfil] = await db
    .select({ materias: profiles.materiasPrioritarias })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const prioritarias = (perfil?.materias as string[]) ?? [];
  const itens = gerarPlanoDoDia(energia, prioritarias);
  const data = hojeISO();

  // Upsert sessão do dia com a energia escolhida.
  await db
    .insert(sessoes)
    .values({ userId: user.id, data, energia })
    .onConflictDoUpdate({
      target: [sessoes.userId, sessoes.data],
      set: { energia },
    });

  // Upsert plano do dia (substitui o anterior se o aluno refez check-in).
  await db
    .insert(planoDoDia)
    .values({ userId: user.id, data, itens })
    .onConflictDoUpdate({
      target: [planoDoDia.userId, planoDoDia.data],
      set: { itens, gerado: sql`NOW()` },
    });

  revalidatePath("/rotina");
  revalidatePath("/trilha");
  return { ok: true };
}
