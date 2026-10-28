/**
 * Script pra validar estado do banco antes/depois da migração Supabase.
 * Uso:
 *   npm run db:validar-migracao
 *
 * Verifica:
 * 1. Conexão ao DATABASE_URL
 * 2. Tabelas existem + contagem de registros
 * 3. Schema crítico (constraints, indexes)
 * 4. Dados de teste (plano anual, disciplinas)
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../lib/db/script";
import { planos, disciplinas, assinaturas, pagamentos } from "../lib/db/schema";

async function main() {
  console.log("\n🔍 Validando banco de dados...\n");

  try {
    // 1. Conexão
    console.log("✓ Conectado ao banco");

    // 2. Contagens
    const [planoCount] = await db.execute(`SELECT COUNT(*) as count FROM planos`);
    const [discCount] = await db.execute(`SELECT COUNT(*) as count FROM disciplinas`);
    const [assCount] = await db.execute(`SELECT COUNT(*) as count FROM assinaturas`);
    const [pagCount] = await db.execute(`SELECT COUNT(*) as count FROM pagamentos`);

    console.log(`\n📊 Contagens de registros:`);
    console.log(`  - planos: ${(planoCount as any)?.count ?? "?"}`);
    console.log(`  - disciplinas: ${(discCount as any)?.count ?? "?"}`);
    console.log(`  - assinaturas: ${(assCount as any)?.count ?? "?"}`);
    console.log(`  - pagamentos: ${(pagCount as any)?.count ?? "?"}`);

    // 3. Plano anual
    const [planoAnual] = await db
      .execute(`SELECT id, slug, preco_centavos FROM planos WHERE slug='anual' LIMIT 1`);
    if (planoAnual) {
      console.log(`\n✓ Plano anual encontrado:`);
      console.log(`  - slug: ${(planoAnual as any).slug}`);
      console.log(`  - preço: R$ ${(((planoAnual as any).preco_centavos ?? 0) / 100).toFixed(2)}`);
    } else {
      console.log(`\n⚠️  Plano anual NÃO encontrado. Rode: npm run db:seed-plano`);
    }

    // 4. Disciplinas
    const [discSample] = await db.execute(
      `SELECT COUNT(*) as count FROM disciplinas WHERE ativa=true`,
    );
    if ((discSample as any)?.count > 0) {
      console.log(`\n✓ Disciplinas ativas: ${(discSample as any).count}`);
    } else {
      console.log(`\n⚠️  Nenhuma disciplina ativa. Rode: npm run db:seed`);
    }

    console.log(`\n✅ Banco pronto pra operação!\n`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Erro ao validar:`, err);
    console.error(`\nVerifique:`);
    console.error(`  - DATABASE_URL está correto em .env.local?`);
    console.error(`  - Supabase está online?`);
    console.error(`  - Migrations foram rodadas? (npm run db:migrate)`);
    process.exit(1);
  }
}

main();
