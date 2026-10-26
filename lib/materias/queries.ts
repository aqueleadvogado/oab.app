import "server-only";
import { db } from "@/lib/db";
import {
  blocos,
  disciplinas,
  questoes,
  topicos,
  respostas,
} from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { DISCIPLINAS_ESTATICAS } from "@/lib/disciplinas-estaticas";

export type ResumoMateria = {
  slug: string;
  nome: string;
  cor: string;
  corHex: string;
  emoji: string;
  peso: number;
  blocosPublicados: number;
  blocosEmRevisao: number;
  questoesClassificadas: number;
  respostasUsuario: number;
  acertosUsuario: number;
};

/**
 * Monta o resumo por disciplina com 4 queries pequenas em paralelo
 * (mais simples e robusto que subqueries SQL inline).
 */
export async function resumoMaterias(userId: string): Promise<ResumoMateria[]> {
  const [blocosRows, questoesRows, respUsuario] = await Promise.all([
    // 1) contagem de blocos por disciplina e por status
    db
      .select({
        disciplinaSlug: disciplinas.slug,
        status: blocos.status,
        total: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(blocos)
      .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
      .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
      .groupBy(disciplinas.slug, blocos.status),

    // 2) contagem de questões classificadas por disciplina
    db
      .select({
        disciplinaSlug: disciplinas.slug,
        total: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(questoes)
      .innerJoin(topicos, eq(questoes.topicoClassificadoId, topicos.id))
      .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
      .groupBy(disciplinas.slug),

    // 3) respostas do usuário por disciplina (acertos vs total)
    db
      .select({
        disciplinaSlug: disciplinas.slug,
        total: sql<number>`COUNT(*)`.mapWith(Number),
        acertos: sql<number>`COUNT(*) FILTER (WHERE ${respostas.acertou} = TRUE)`.mapWith(Number),
      })
      .from(respostas)
      .innerJoin(questoes, eq(respostas.questaoId, questoes.id))
      .innerJoin(topicos, eq(questoes.topicoClassificadoId, topicos.id))
      .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
      .where(eq(respostas.userId, userId))
      .groupBy(disciplinas.slug),
  ]);

  // Agrega em memória por disciplina
  const porSlug = new Map<
    string,
    { publicados: number; emRevisao: number; classif: number; respostas: number; acertos: number }
  >();

  for (const r of blocosRows) {
    const atual = porSlug.get(r.disciplinaSlug) ?? {
      publicados: 0,
      emRevisao: 0,
      classif: 0,
      respostas: 0,
      acertos: 0,
    };
    if (r.status === "publicado") atual.publicados += r.total;
    if (r.status === "em_revisao") atual.emRevisao += r.total;
    porSlug.set(r.disciplinaSlug, atual);
  }

  for (const r of questoesRows) {
    const atual = porSlug.get(r.disciplinaSlug) ?? {
      publicados: 0,
      emRevisao: 0,
      classif: 0,
      respostas: 0,
      acertos: 0,
    };
    atual.classif = r.total;
    porSlug.set(r.disciplinaSlug, atual);
  }

  for (const r of respUsuario) {
    const atual = porSlug.get(r.disciplinaSlug) ?? {
      publicados: 0,
      emRevisao: 0,
      classif: 0,
      respostas: 0,
      acertos: 0,
    };
    atual.respostas = r.total;
    atual.acertos = r.acertos;
    porSlug.set(r.disciplinaSlug, atual);
  }

  // Monta a lista final na ordem didática fixa das 20 disciplinas
  return DISCIPLINAS_ESTATICAS.map((d) => {
    const s = porSlug.get(d.slug) ?? {
      publicados: 0,
      emRevisao: 0,
      classif: 0,
      respostas: 0,
      acertos: 0,
    };
    return {
      slug: d.slug,
      nome: d.nome,
      cor: d.cor,
      corHex: d.corHex,
      emoji: d.emoji,
      peso: d.peso,
      blocosPublicados: s.publicados,
      blocosEmRevisao: s.emRevisao,
      questoesClassificadas: s.classif,
      respostasUsuario: s.respostas,
      acertosUsuario: s.acertos,
    };
  });
}
