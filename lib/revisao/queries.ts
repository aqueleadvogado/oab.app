import "server-only";
import { db } from "@/lib/db";
import {
  revisoes,
  cartoes,
  questoes,
  blocos,
  topicos,
  disciplinas,
} from "@/lib/db/schema";
import { and, eq, lte, asc } from "drizzle-orm";

export type ItemRevisao = {
  revisaoId: string;
  tipo: "cartao" | "questao";
  dueAt: Date;
  fator: string;
  intervaloDias: number;
  lapsos: number;
  cartao?: {
    frente: string;
    verso: string;
  };
  questao?: {
    enunciado: string;
    alternativas: { chave: string; texto: string }[];
    correta: string;
    comentario: string | null;
  };
  disciplinaNome: string | null;
  disciplinaCor: string | null;
};

export async function listarRevisoesVencidas(userId: string): Promise<ItemRevisao[]> {
  const agora = new Date();

  const rows = await db
    .select({
      revisao: revisoes,
      cartao: cartoes,
      questao: questoes,
      bloco: blocos,
      topico: topicos,
      disciplina: disciplinas,
    })
    .from(revisoes)
    .leftJoin(cartoes, eq(revisoes.cartaoId, cartoes.id))
    .leftJoin(questoes, eq(revisoes.questaoId, questoes.id))
    .leftJoin(blocos, eq(cartoes.blocoId, blocos.id))
    .leftJoin(topicos, eq(blocos.topicoId, topicos.id))
    .leftJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(and(eq(revisoes.userId, userId), lte(revisoes.dueAt, agora)))
    .orderBy(asc(revisoes.dueAt))
    .limit(50);

  const items: ItemRevisao[] = [];
  for (const r of rows) {
    const base = {
      revisaoId: r.revisao.id,
      dueAt: r.revisao.dueAt,
      fator: r.revisao.fator,
      intervaloDias: r.revisao.intervaloDias,
      lapsos: r.revisao.lapsos,
      disciplinaNome: r.disciplina?.nome ?? null,
      disciplinaCor: r.disciplina?.cor ?? null,
    };
    if (r.cartao) {
      items.push({
        ...base,
        tipo: "cartao",
        cartao: { frente: r.cartao.frente, verso: r.cartao.verso },
      });
    } else if (r.questao) {
      items.push({
        ...base,
        tipo: "questao",
        questao: {
          enunciado: r.questao.enunciado,
          alternativas: r.questao.alternativas as {
            chave: string;
            texto: string;
          }[],
          correta: r.questao.correta,
          comentario: r.questao.comentario,
        },
      });
    }
  }
  return items;
}

export async function contarRevisoesVencidas(userId: string): Promise<number> {
  const agora = new Date();
  const rows = await db
    .select({ id: revisoes.id })
    .from(revisoes)
    .where(and(eq(revisoes.userId, userId), lte(revisoes.dueAt, agora)));
  return rows.length;
}
