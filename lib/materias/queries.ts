import "server-only";
import { db } from "@/lib/db";
import {
  blocos,
  disciplinas,
  questoes,
  topicos,
  respostas,
} from "@/lib/db/schema";
import { and, eq, sql, inArray } from "drizzle-orm";
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
  questoesClassificadas: number; // questões FGV atribuídas a essa disciplina
  respostasUsuario: number;
  acertosUsuario: number;
};

export async function resumoMaterias(userId: string): Promise<ResumoMateria[]> {
  // Contagens agregadas por disciplina em UMA só query
  const rows = await db
    .select({
      disciplinaSlug: disciplinas.slug,
      disciplinaId: disciplinas.id,
      blocosPublicados: sql<number>`
        (SELECT COUNT(*) FROM ${blocos}
         INNER JOIN ${topicos} AS t2 ON ${blocos.topicoId} = t2.id
         WHERE t2.disciplina_id = ${disciplinas.id}
           AND ${blocos.status} = 'publicado')
      `.mapWith(Number),
      blocosEmRevisao: sql<number>`
        (SELECT COUNT(*) FROM ${blocos}
         INNER JOIN ${topicos} AS t3 ON ${blocos.topicoId} = t3.id
         WHERE t3.disciplina_id = ${disciplinas.id}
           AND ${blocos.status} = 'em_revisao')
      `.mapWith(Number),
      questoesClassificadas: sql<number>`
        (SELECT COUNT(*) FROM ${questoes}
         INNER JOIN ${topicos} AS t4 ON ${questoes.topicoClassificadoId} = t4.id
         WHERE t4.disciplina_id = ${disciplinas.id})
      `.mapWith(Number),
    })
    .from(disciplinas);

  const idPorSlug = new Map(rows.map((r) => [r.disciplinaSlug, r.disciplinaId]));

  // Progresso do usuário por disciplina (via respostas)
  const respUsuario = await db
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
    .groupBy(disciplinas.slug);

  const respPorSlug = new Map(respUsuario.map((r) => [r.disciplinaSlug, r]));

  // Monta na ordem estática (que é a ordem didática/pedagógica desejada)
  return DISCIPLINAS_ESTATICAS.map((d) => {
    const r = rows.find((x) => x.disciplinaSlug === d.slug);
    const u = respPorSlug.get(d.slug);
    return {
      slug: d.slug,
      nome: d.nome,
      cor: d.cor,
      corHex: d.corHex,
      emoji: d.emoji,
      peso: d.peso,
      blocosPublicados: r?.blocosPublicados ?? 0,
      blocosEmRevisao: r?.blocosEmRevisao ?? 0,
      questoesClassificadas: r?.questoesClassificadas ?? 0,
      respostasUsuario: u?.total ?? 0,
      acertosUsuario: u?.acertos ?? 0,
    };
  });
}
