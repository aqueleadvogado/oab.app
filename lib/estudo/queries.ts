import "server-only";
import { db } from "@/lib/db";
import { blocos, disciplinas, passos, questoes, topicos } from "@/lib/db/schema";
import { and, eq, asc } from "drizzle-orm";

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

/** Lista blocos publicados por disciplina (para a trilha). */
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
    .where(eq(blocos.status, "publicado"))
    .orderBy(asc(disciplinas.ordem), asc(blocos.ordem));
}
