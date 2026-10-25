import "server-only";
import { db } from "@/lib/db";
import { blocos, disciplinas, passos, questoes, topicos } from "@/lib/db/schema";
import { and, eq, asc, ne, sql } from "drizzle-orm";

// Disciplinas que não devem aparecer na trilha "didática" (são simulados etc).
const DISCIPLINAS_EXCLUIDAS_DA_TRILHA = ["simulados-fgv"];

export type BlocoCompleto = Awaited<ReturnType<typeof carregarBlocoCompleto>>;

export async function carregarBlocoCompleto(blocoId: string) {
  const [row] = await db
    .select({
      bloco: blocos,
      topico: topicos,
      disciplina: disciplinas,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(and(eq(blocos.id, blocoId), eq(blocos.status, "publicado")))
    .limit(1);

  if (!row) return null;

  const [passosList, questoesList] = await Promise.all([
    db
      .select()
      .from(passos)
      .where(eq(passos.blocoId, blocoId))
      .orderBy(asc(passos.ordem)),
    db
      .select()
      .from(questoes)
      .where(and(eq(questoes.blocoId, blocoId), eq(questoes.status, "publicado"))),
  ]);

  return { ...row, passos: passosList, questoes: questoesList };
}

/** Lista blocos publicados DIDÁTICOS (exclui simulados FGV). */
export async function listarBlocosPublicados() {
  return db
    .select({
      blocoId: blocos.id,
      titulo: blocos.titulo,
      duracaoMin: blocos.duracaoMin,
      topicoNome: topicos.nome,
      disciplinaSlug: disciplinas.slug,
      disciplinaNome: disciplinas.nome,
      cor: disciplinas.cor,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(
      and(
        eq(blocos.status, "publicado"),
        sql`${disciplinas.slug} NOT IN (${sql.join(
          DISCIPLINAS_EXCLUIDAS_DA_TRILHA.map((s) => sql`${s}`),
          sql`, `,
        )})`,
      ),
    )
    .orderBy(asc(disciplinas.ordem), asc(blocos.ordem));
}

/** Lista simulados FGV (prova completa de cada exame). */
export async function listarSimuladosFgv() {
  const rows = await db
    .select({
      blocoId: blocos.id,
      titulo: blocos.titulo,
      resumo: blocos.resumo,
      duracaoMin: blocos.duracaoMin,
      topicoNome: topicos.nome,
      topicoSlug: topicos.slug,
      disciplinaSlug: disciplinas.slug,
      totalQuestoes: sql<number>`(SELECT COUNT(*) FROM ${questoes} WHERE ${questoes.blocoId} = ${blocos.id})`,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(
      and(
        eq(blocos.status, "publicado"),
        eq(disciplinas.slug, "simulados-fgv"),
      ),
    )
    .orderBy(asc(topicos.ordem));
  return rows;
}
