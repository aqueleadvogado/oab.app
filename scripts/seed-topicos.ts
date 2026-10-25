/**
 * Insere os tópicos esqueleto de todas as 20 disciplinas no banco.
 * Idempotente: pula tópicos que já existem (unique no slug por disciplina).
 *
 * Rodar: npm run db:seed-topicos
 */

import { db } from "../lib/db/script";
import { disciplinas, topicos } from "../lib/db/schema";
import { eq, and } from "drizzle-orm";
import { TOPICOS_POR_DISCIPLINA } from "../lib/edital/topicos";
import { DISCIPLINAS_ESTATICAS } from "../lib/disciplinas-estaticas";

async function main() {
  // Garante as 20 disciplinas (idempotente — db:seed já faz, mas por garantia)
  for (const d of DISCIPLINAS_ESTATICAS) {
    await db
      .insert(disciplinas)
      .values({
        slug: d.slug,
        nome: d.nome,
        cor: d.cor,
        pesoProva: d.peso,
        ordem: DISCIPLINAS_ESTATICAS.indexOf(d),
      })
      .onConflictDoNothing({ target: disciplinas.slug });
  }

  let totalInseridos = 0;
  let totalPulados = 0;

  for (const [disciplinaSlug, lista] of Object.entries(TOPICOS_POR_DISCIPLINA)) {
    const [disc] = await db
      .select({ id: disciplinas.id, nome: disciplinas.nome })
      .from(disciplinas)
      .where(eq(disciplinas.slug, disciplinaSlug))
      .limit(1);

    if (!disc) {
      console.log(`  [!] Disciplina '${disciplinaSlug}' não encontrada, pulando`);
      continue;
    }

    console.log(`\n${disc.nome} (${lista.length} tópicos)`);
    for (let i = 0; i < lista.length; i++) {
      const t = lista[i];
      const [existente] = await db
        .select({ id: topicos.id })
        .from(topicos)
        .where(and(eq(topicos.disciplinaId, disc.id), eq(topicos.slug, t.slug)))
        .limit(1);

      if (existente) {
        totalPulados++;
        console.log(`  · ${t.slug} (ja existe)`);
        continue;
      }

      await db.insert(topicos).values({
        disciplinaId: disc.id,
        slug: t.slug,
        nome: t.nome,
        ordem: i,
        leiReferencia: t.leiReferencia ?? null,
      });
      totalInseridos++;
      console.log(`  + ${t.slug}`);
    }
  }

  console.log(
    `\nTotal: ${totalInseridos} inseridos, ${totalPulados} já existiam.`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
