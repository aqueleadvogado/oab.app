import "server-only";
import { db } from "@/lib/db";
import {
  blocos,
  topicos,
  disciplinas,
  passos,
  questoes,
  cartoes,
} from "@/lib/db/schema";
import { and, eq, inArray, asc } from "drizzle-orm";

export async function listarBlocosPorStatus(
  status: ("rascunho" | "em_revisao" | "aprovado" | "publicado")[],
) {
  return db
    .select({
      id: blocos.id,
      titulo: blocos.titulo,
      resumo: blocos.resumo,
      duracaoMin: blocos.duracaoMin,
      status: blocos.status,
      criadoEm: blocos.criadoEm,
      disciplinaNome: disciplinas.nome,
      disciplinaCor: disciplinas.cor,
      disciplinaSlug: disciplinas.slug,
      topicoNome: topicos.nome,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(inArray(blocos.status, status))
    .orderBy(asc(disciplinas.ordem), asc(blocos.criadoEm));
}

export async function carregarBlocoParaRevisao(blocoId: string) {
  const [row] = await db
    .select({
      bloco: blocos,
      topico: topicos,
      disciplina: disciplinas,
    })
    .from(blocos)
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(eq(blocos.id, blocoId))
    .limit(1);

  if (!row) return null;

  const [passosList, questoesList, cartoesList] = await Promise.all([
    db
      .select()
      .from(passos)
      .where(eq(passos.blocoId, blocoId))
      .orderBy(asc(passos.ordem)),
    db.select().from(questoes).where(eq(questoes.blocoId, blocoId)),
    db.select().from(cartoes).where(eq(cartoes.blocoId, blocoId)),
  ]);

  return {
    ...row,
    passos: passosList,
    questoes: questoesList,
    cartoes: cartoesList,
  };
}
