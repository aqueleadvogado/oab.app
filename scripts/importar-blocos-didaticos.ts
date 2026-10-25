/**
 * Importa blocos didáticos a partir de scripts/blocos-*.json.
 * Status inicial: "em_revisao" (não aparece para alunos até ser aprovado via admin).
 *
 * Formato esperado de cada JSON (array):
 * [
 *   {
 *     "topico_slug": "inscricao-oab",
 *     "titulo": "...", "resumo": "...", "duracao_min": 14,
 *     "passos": [{ "tipo": "mapa", "conteudo_md": "..." }, ...],
 *     "questoes": [{
 *       "enunciado": "...", "alternativas": [{chave, texto}, ...],
 *       "correta": "A", "comentario": "...", "lei_referencia": "..."
 *     }],
 *     "cartoes": [{ "frente": "...", "verso": "..." }]
 *   }
 * ]
 *
 * Rodar: npm run db:importar-blocos -- scripts/blocos-etica-grupo-1.json scripts/blocos-etica-grupo-2.json ...
 * (ou sem args — pega todos os arquivos scripts/blocos-*.json)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../lib/db/script";
import {
  disciplinas,
  topicos,
  blocos,
  passos,
  questoes,
  cartoes,
} from "../lib/db/schema";
import { and, eq } from "drizzle-orm";

type Entrada = {
  topico_slug: string;
  titulo: string;
  resumo?: string;
  duracao_min?: number;
  passos: { tipo: string; conteudo_md: string }[];
  questoes: {
    enunciado: string;
    alternativas: { chave: string; texto: string }[];
    correta: string;
    comentario?: string;
    lei_referencia?: string;
    tags?: string[];
    nivel?: number;
  }[];
  cartoes?: { frente: string; verso: string }[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));

function listarArquivos(): string[] {
  const args = process.argv.slice(2);
  if (args.length > 0) return args;
  // Default: tudo que casar com scripts/blocos-*.json
  const scriptsDir = __dirname;
  return readdirSync(scriptsDir)
    .filter((f) => /^blocos-.*\.json$/.test(f))
    .map((f) => join(scriptsDir, f));
}

async function importarBloco(entrada: Entrada): Promise<"inserido" | "pulado"> {
  // Resolve topicoId pelo slug (precisa procurar em todas as disciplinas)
  const [topico] = await db
    .select({ id: topicos.id, disciplinaId: topicos.disciplinaId })
    .from(topicos)
    .where(eq(topicos.slug, entrada.topico_slug))
    .limit(1);

  if (!topico) {
    console.log(`  [!] Tópico '${entrada.topico_slug}' não encontrado — rode db:seed-topicos antes`);
    return "pulado";
  }

  // Evita duplicata pelo título dentro do tópico
  const [existente] = await db
    .select({ id: blocos.id })
    .from(blocos)
    .where(and(eq(blocos.topicoId, topico.id), eq(blocos.titulo, entrada.titulo)))
    .limit(1);

  if (existente) {
    console.log(`  · "${entrada.titulo}" ja existe (${existente.id}) — pulando`);
    return "pulado";
  }

  const [bloco] = await db
    .insert(blocos)
    .values({
      topicoId: topico.id,
      titulo: entrada.titulo,
      resumo: entrada.resumo ?? null,
      duracaoMin: entrada.duracao_min ?? 15,
      ordem: 0,
      status: "em_revisao",
    })
    .returning();

  if (entrada.passos?.length) {
    await db.insert(passos).values(
      entrada.passos.map((p, i) => ({
        blocoId: bloco.id,
        ordem: i,
        tipo: p.tipo as "mapa" | "macete" | "pegadinha" | "exemplo" | "texto" | "questao",
        conteudoMd: p.conteudo_md,
      })),
    );
  }

  if (entrada.questoes?.length) {
    await db.insert(questoes).values(
      entrada.questoes.map((q) => ({
        blocoId: bloco.id,
        topicoClassificadoId: topico.id,
        enunciado: q.enunciado,
        alternativas: q.alternativas,
        correta: q.correta,
        comentario: q.comentario ?? null,
        tags: q.tags ?? ["autoral"],
        nivel: q.nivel ?? 3,
        leiReferencia: q.lei_referencia ?? null,
        status: "em_revisao" as const,
      })),
    );
  }

  if (entrada.cartoes?.length) {
    await db.insert(cartoes).values(
      entrada.cartoes.map((c) => ({
        blocoId: bloco.id,
        frente: c.frente,
        verso: c.verso,
        tags: ["autoral"],
        status: "em_revisao" as const,
      })),
    );
  }

  console.log(
    `  + "${entrada.titulo}" (${entrada.passos?.length ?? 0}p, ${entrada.questoes?.length ?? 0}q, ${entrada.cartoes?.length ?? 0}c)`,
  );
  return "inserido";
}

async function main() {
  const arquivos = listarArquivos();
  if (arquivos.length === 0) {
    console.log("Nenhum arquivo scripts/blocos-*.json encontrado.");
    process.exit(0);
  }

  let totalInseridos = 0;
  let totalPulados = 0;

  for (const arq of arquivos) {
    console.log(`\n${basename(arq)}`);
    const entradas: Entrada[] = JSON.parse(readFileSync(arq, "utf8"));
    for (const e of entradas) {
      const r = await importarBloco(e);
      if (r === "inserido") totalInseridos++;
      else totalPulados++;
    }
  }

  console.log(`\n${totalInseridos} bloco(s) importado(s) com status 'em_revisao'. ${totalPulados} pulado(s).`);
  console.log(`Para publicar: pelo admin (fase 4) ou SQL manual UPDATE blocos SET status='publicado' WHERE ...`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
