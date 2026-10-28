/**
 * Seed do plano anual R$ 97. Idempotente — pode rodar quantas vezes quiser.
 * Rodar: npm run db:seed-plano
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../lib/db/script";
import { planos } from "../lib/db/schema";

async function main() {
  const [plano] = await db
    .insert(planos)
    .values({
      slug: "anual",
      nome: "Assinatura anual",
      descricao: "Acesso completo ao OAB em Blocos por 12 meses.",
      precoCentavos: 9700,
      periodicidadeDias: 365,
      ativo: true,
    })
    .onConflictDoUpdate({
      target: planos.slug,
      set: {
        nome: "Assinatura anual",
        descricao: "Acesso completo ao OAB em Blocos por 12 meses.",
        precoCentavos: 9700,
        periodicidadeDias: 365,
        ativo: true,
      },
    })
    .returning();

  console.log("Plano garantido:");
  console.log(`  id: ${plano.id}`);
  console.log(`  slug: ${plano.slug}`);
  console.log(`  preco: R$ ${(plano.precoCentavos / 100).toFixed(2)}`);
  console.log(`  periodicidade: ${plano.periodicidadeDias} dias`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
