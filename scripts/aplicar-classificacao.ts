/**
 * Lê classificacao-lote-{1..4}.json, resolve cada topico_slug para o topicoId
 * no banco e atualiza questoes.topicoClassificadoId.
 *
 * Casa a classificação com a questão real pelo tag "questao-N" dentro do bloco
 * do exame correspondente.
 *
 * Rodar: npm run db:aplicar-classificacao
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../lib/db/script";
import { blocos, disciplinas, questoes, topicos } from "../lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

type Classificacao = {
  questao_id: string; // "Q-46-1"
  disciplina_slug: string;
  topico_slug: string;
  confianca: "alta" | "media" | "baixa";
  nota: string | null;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

function carregarClassificacoes(): Classificacao[] {
  const todas: Classificacao[] = [];
  for (let i = 1; i <= 4; i++) {
    const p = join(__dirname, `classificacao-lote-${i}.json`);
    const arr: Classificacao[] = JSON.parse(readFileSync(p, "utf8"));
    todas.push(...arr);
  }
  return todas;
}

async function main() {
  const classificacoes = carregarClassificacoes();
  console.log(`Carregadas ${classificacoes.length} classificações`);

  // 1) Monta mapa (disciplinaSlug, topicoSlug) -> topicoId
  const linhas = await db
    .select({
      topicoId: topicos.id,
      topicoSlug: topicos.slug,
      disciplinaSlug: disciplinas.slug,
    })
    .from(topicos)
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id));

  const mapa = new Map<string, string>();
  for (const l of linhas) {
    mapa.set(`${l.disciplinaSlug}/${l.topicoSlug}`, l.topicoId);
  }
  console.log(`Mapa com ${mapa.size} tópicos existentes no banco.`);

  // 2) Monta mapa questao_id -> id real no banco (via tag questao-N e bloco do exame)
  // A questão FGV foi inserida com tags = ["FGV", "exame-X", "questao-N"]
  const todasFgv = await db
    .select({
      id: questoes.id,
      tags: questoes.tags,
    })
    .from(questoes)
    .innerJoin(blocos, eq(questoes.blocoId, blocos.id))
    .innerJoin(topicos, eq(blocos.topicoId, topicos.id))
    .innerJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(eq(disciplinas.slug, "simulados-fgv"));

  const mapaId = new Map<string, string>();
  for (const q of todasFgv) {
    const tags = (q.tags as string[]) ?? [];
    const exame = tags.find((t) => t.startsWith("exame-"))?.slice(6);
    const num = tags.find((t) => t.startsWith("questao-"))?.slice(8);
    if (exame && num) {
      mapaId.set(`Q-${exame}-${num}`, q.id);
    }
  }
  console.log(`Encontradas ${mapaId.size} questões FGV no banco.`);

  // 3) Para cada classificação, resolve e atualiza
  let aplicadas = 0;
  let topicoInexistente = 0;
  let questaoInexistente = 0;

  for (const c of classificacoes) {
    const chave = `${c.disciplina_slug}/${c.topico_slug}`;
    const topicoId = mapa.get(chave);
    if (!topicoId) {
      console.log(`  [!] Tópico inexistente: ${chave} (questão ${c.questao_id})`);
      topicoInexistente++;
      continue;
    }
    const questaoId = mapaId.get(c.questao_id);
    if (!questaoId) {
      console.log(`  [!] Questão não encontrada: ${c.questao_id}`);
      questaoInexistente++;
      continue;
    }
    await db
      .update(questoes)
      .set({ topicoClassificadoId: topicoId })
      .where(eq(questoes.id, questaoId));
    aplicadas++;
  }

  console.log(`\n${aplicadas} questões classificadas.`);
  if (topicoInexistente > 0) console.log(`${topicoInexistente} tópicos inexistentes (seed-topicos faltando).`);
  if (questaoInexistente > 0) console.log(`${questaoInexistente} questões não encontradas no banco.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
