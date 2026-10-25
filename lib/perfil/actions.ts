"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; erro: string };

export type PrefsAcessibilidade = {
  tamanhoFonte?: "menor" | "normal" | "maior";
  espacamento?: "normal" | "amplo";
  fonteLegivel?: boolean;
  altoContraste?: boolean;
  tema?: "claro" | "escuro" | "sistema";
  reduzirAnimacoes?: boolean;
  modoFoco?: boolean;
};

async function userLogado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function atualizarPerfilBasico(
  formData: FormData,
): Promise<ActionResult> {
  const user = await userLogado();
  if (!user) return { ok: false, erro: "Não autenticado." };

  const nome = String(formData.get("nome") ?? "").trim() || null;
  const dataProva = String(formData.get("data_prova") ?? "").trim() || null;
  const horarioLembrete =
    String(formData.get("horario_lembrete") ?? "").trim() || null;
  const materiasRaw = formData.getAll("materias_prioritarias").map(String);
  const materiasPrioritarias = materiasRaw.filter(Boolean);

  await db
    .update(profiles)
    .set({
      nome,
      dataProva,
      horarioLembrete,
      materiasPrioritarias,
      atualizadoEm: new Date(),
    })
    .where(eq(profiles.id, user.id));

  revalidatePath("/conta");
  return { ok: true };
}

export async function atualizarPreferenciasAcessibilidade(
  formData: FormData,
): Promise<ActionResult> {
  const user = await userLogado();
  if (!user) return { ok: false, erro: "Não autenticado." };

  const prefs: PrefsAcessibilidade = {
    tamanhoFonte:
      (formData.get("tamanho_fonte") as PrefsAcessibilidade["tamanhoFonte"]) ??
      "normal",
    espacamento:
      (formData.get("espacamento") as PrefsAcessibilidade["espacamento"]) ??
      "normal",
    fonteLegivel: formData.get("fonte_legivel") === "on",
    altoContraste: formData.get("alto_contraste") === "on",
    tema:
      (formData.get("tema") as PrefsAcessibilidade["tema"]) ?? "sistema",
    reduzirAnimacoes: formData.get("reduzir_animacoes") === "on",
    modoFoco: formData.get("modo_foco") === "on",
  };

  await db
    .update(profiles)
    .set({ prefsAcessibilidade: prefs, atualizadoEm: new Date() })
    .where(eq(profiles.id, user.id));

  revalidatePath("/conta");
  return { ok: true };
}
