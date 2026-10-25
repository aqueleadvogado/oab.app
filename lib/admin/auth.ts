import "server-only";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { papeis } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export type PapelUsuario = "admin" | "revisor_juridico" | "suporte";

export async function usuarioLogadoComPapel(papel: PapelUsuario) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [p] = await db
    .select({ papel: papeis.papel })
    .from(papeis)
    .where(and(eq(papeis.userId, user.id), eq(papeis.papel, papel)))
    .limit(1);

  return p ? user : null;
}

export async function temPapel(userId: string, papel: PapelUsuario) {
  const [p] = await db
    .select({ id: papeis.userId })
    .from(papeis)
    .where(and(eq(papeis.userId, userId), eq(papeis.papel, papel)))
    .limit(1);
  return !!p;
}
