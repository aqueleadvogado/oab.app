import "server-only";
import { db } from "@/lib/db";
import {
  blocos,
  disciplinas,
  questoes,
  topicos,
  respostas,
} from "@/lib/db/schema";
import { and, eq, sql, asc, desc } from "drizzle-orm";

export async function carregarDetalheDisciplina(slug: string, userId: string) {
  const [disc] = await db
    .select()
    .from(disciplinas)
    .where(eq(disciplinas.slug, slug))
    .limit(1);
  if (!disc) return null;

  const topicosList = await db
    .select({
      id: topicos.id,
      slug: topicos.slug,
      nome: topicos.nome,
      ordem: topicos.ordem,
      leiReferencia: topicos.leiReferencia,
    })
    .from(topicos)
    .where(eq(topicos.disciplinaId, disc.id))
    .orderBy(asc(topicos.ordem));

  const blocosPublicados = await db
    .select({
      id: blocos.id,
      titulo: blocos.titulo,
      duracaoMin: blocos.duracaoMin,
      topicoNome: topicos.nome,
      topicoId: topicos.id,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .where(and(eq(topicos.disciplinaId, disc.id), eq(blocos.status, "publicado")))
    .orderBy(asc(topicos.ordem), asc(blocos.ordem));

  const [qtdQuestoes] = await db
    .select({ total: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(questoes)
    .innerJoin(topicos, eq(questoes.topicoClassificadoId, topicos.id))
    .where(eq(topicos.disciplinaId, disc.id));

  const [respUser] = await db
    .select({
      total: sql<number>`COUNT(*)`.mapWith(Number),
      acertos: sql<number>`COUNT(*) FILTER (WHERE ${respostas.acertou} = TRUE)`.mapWith(Number),
    })
    .from(respostas)
    .innerJoin(questoes, eq(respostas.questaoId, questoes.id))
    .innerJoin(topicos, eq(questoes.topicoClassificadoId, topicos.id))
    .where(and(eq(respostas.userId, userId), eq(topicos.disciplinaId, disc.id)));

  return {
    disciplina: disc,
    topicos: topicosList,
    blocosPublicados,
    totalQuestoes: qtdQuestoes?.total ?? 0,
    respostasUsuario: respUser?.total ?? 0,
    acertosUsuario: respUser?.acertos ?? 0,
  };
}
