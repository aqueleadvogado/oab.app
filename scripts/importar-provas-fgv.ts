/**
 * Importa 160 questões dos 46º e 47º Exames FGV no banco.
 * Pré-requisito: ter rodado os dois scripts Python:
 *   - python scripts/extrair-provas-fgv.py   → questoes-fgv.json
 *   - python scripts/extrair-gabaritos-fgv.py → gabarito-fgv.json
 *
 * Estrutura criada:
 *   Disciplina "simulados-fgv" (slug único — não aparece como estudo normal)
 *   └─ Tópico "exame-46" / "exame-47"
 *      └─ Bloco "46º Exame de Ordem FGV" (publicado, 80 questões)
 *         └─ 80 questões com leiReferencia "FGV — Xº Exame de Ordem, questão N"
 *                                tags ["FGV", "exame-X", "questao-N"]
 *
 * Classificação por disciplina real (Ética, Civil, etc.) fica para fase posterior.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../lib/db/script";
import {
  disciplinas,
  topicos,
  blocos,
  questoes,
} from "../lib/db/schema";
import { and, eq } from "drizzle-orm";

type QuestaoBruta = {
  exame: number;
  numero: number;
  enunciado: string;
  alternativas: { chave: string; texto: string }[];
  correta: string | null;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const questoesPath = join(__dirname, "questoes-fgv.json");
const gabaritoPath = join(__dirname, "gabarito-fgv.json");

const questoesRaw: QuestaoBruta[] = JSON.parse(
  readFileSync(questoesPath, "utf8"),
);
const gabarito: Record<string, Record<string, string>> = JSON.parse(
  readFileSync(gabaritoPath, "utf8"),
);

async function main() {
  console.log("1/4 Garantindo disciplina 'simulados-fgv'...");
  let [disc] = await db
    .select()
    .from(disciplinas)
    .where(eq(disciplinas.slug, "simulados-fgv"))
    .limit(1);
  if (!disc) {
    [disc] = await db
      .insert(disciplinas)
      .values({
        slug: "simulados-fgv",
        nome: "Simulados — Provas FGV",
        cor: "navy",
        pesoProva: 0,
        ordem: 999,
      })
      .returning();
  }

  const exames = Array.from(new Set(questoesRaw.map((q) => q.exame))).sort();
  let totalInseridas = 0;

  for (const exame of exames) {
    console.log(`\n2/4 Tópico 'exame-${exame}'...`);
    let [topico] = await db
      .select()
      .from(topicos)
      .where(
        and(
          eq(topicos.disciplinaId, disc.id),
          eq(topicos.slug, `exame-${exame}`),
        ),
      )
      .limit(1);
    if (!topico) {
      [topico] = await db
        .insert(topicos)
        .values({
          disciplinaId: disc.id,
          slug: `exame-${exame}`,
          nome: `${exame}º Exame de Ordem Unificado`,
          ordem: exame,
          leiReferencia: `Prova aplicada pela FGV`,
        })
        .returning();
    }

    console.log(`3/4 Bloco "${exame}º Exame FGV"...`);
    let [bloco] = await db
      .select()
      .from(blocos)
      .where(
        and(
          eq(blocos.topicoId, topico.id),
          eq(blocos.titulo, `${exame}º Exame de Ordem Unificado — FGV`),
        ),
      )
      .limit(1);
    if (!bloco) {
      [bloco] = await db
        .insert(blocos)
        .values({
          topicoId: topico.id,
          titulo: `${exame}º Exame de Ordem Unificado — FGV`,
          duracaoMin: 300,
          resumo: `Simulado completo com as 80 questões objetivas do ${exame}º Exame de Ordem Unificado, aplicado pela FGV. Gabarito oficial.`,
          ordem: 0,
          status: "publicado",
          dataRevisao: new Date(),
        })
        .returning();
    }

    console.log(`4/4 Inserindo 80 questões do ${exame}º Exame...`);
    const gabExame = gabarito[String(exame)] ?? {};
    const questoesDoExame = questoesRaw.filter((q) => q.exame === exame);

    // Remove questões anteriores do bloco (idempotente)
    await db.delete(questoes).where(eq(questoes.blocoId, bloco.id));

    for (const q of questoesDoExame) {
      const correta = gabExame[String(q.numero)] ?? "ANULADA";
      if (correta === "ANULADA") {
        console.log(`  (pulando questão ${q.numero}: anulada)`);
        continue;
      }
      await db.insert(questoes).values({
        blocoId: bloco.id,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        correta,
        comentario: null,
        tags: ["FGV", `exame-${q.exame}`, `questao-${q.numero}`],
        nivel: 3,
        leiReferencia: `FGV — ${exame}º Exame de Ordem, questão ${q.numero}`,
        status: "publicado",
      });
      totalInseridas++;
    }
  }

  console.log(`\nTotal: ${totalInseridas} questões importadas e publicadas.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
