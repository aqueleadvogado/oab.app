/**
 * Seed de conteúdo mínimo para testar o player de blocos.
 * - Garante as 20 disciplinas na tabela
 * - Cria 1 bloco de Ética "Atividades Privativas do Advogado" com
 *   4 passos (mapa, macete, pegadinha, questão) + 2 questões autorais + 2 cartões
 * - Marca como PUBLICADO (bypassa fluxo de revisão porque é bloco de teste)
 *
 * Rodar: npm run db:seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../lib/db/script";
import {
  disciplinas,
  topicos,
  blocos,
  passos,
  questoes,
  cartoes,
} from "../lib/db/schema";
import { DISCIPLINAS_ESTATICAS } from "../lib/disciplinas-estaticas";
import { and, eq } from "drizzle-orm";

async function main() {
  console.log("1/5 Seedando 20 disciplinas (idempotente)...");
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

  const [etica] = await db
    .select()
    .from(disciplinas)
    .where(eq(disciplinas.slug, "etica"))
    .limit(1);
  if (!etica) throw new Error("Disciplina Ética não encontrada após seed");

  console.log("2/5 Criando tópico 'Atividades Privativas'...");
  let [topico] = await db
    .select()
    .from(topicos)
    .where(
      and(
        eq(topicos.disciplinaId, etica.id),
        eq(topicos.slug, "atividades-privativas"),
      ),
    )
    .limit(1);
  if (!topico) {
    [topico] = await db
      .insert(topicos)
      .values({
        disciplinaId: etica.id,
        slug: "atividades-privativas",
        nome: "Atividades Privativas do Advogado",
        ordem: 0,
        leiReferencia: "Lei 8.906/94 (EAOAB) art. 1º",
        versaoNorma: "redação da Lei 14.365/2022",
      })
      .returning();
  }

  console.log("3/5 Criando bloco de exemplo (publicado)...");
  let [bloco] = await db
    .select()
    .from(blocos)
    .where(
      and(eq(blocos.topicoId, topico.id), eq(blocos.titulo, "Atividades privativas: o que só advogado pode fazer")),
    )
    .limit(1);
  if (!bloco) {
    [bloco] = await db
      .insert(blocos)
      .values({
        topicoId: topico.id,
        titulo: "Atividades privativas: o que só advogado pode fazer",
        duracaoMin: 12,
        resumo:
          "O EAOAB art. 1º lista as atividades que ninguém mais pode exercer sem OAB: postulação em juízo e consultoria/assessoria jurídica.",
        ordem: 0,
        status: "publicado",
        dataRevisao: new Date(),
      })
      .returning();
  }

  console.log("4/5 Criando passos do bloco...");
  // Remove passos antigos (se re-rodando) e insere do zero
  await db.delete(passos).where(eq(passos.blocoId, bloco.id));
  await db.insert(passos).values([
    {
      blocoId: bloco.id,
      ordem: 0,
      tipo: "mapa",
      conteudoMd:
        "## O essencial\n\nSão **duas** as atividades privativas de advogado (EAOAB art. 1º):\n\n1. **Postulação** a qualquer órgão do Poder Judiciário e aos juizados especiais\n2. **Atividades de consultoria, assessoria e direção jurídicas**\n\n> Tudo o que estiver fora desses dois guarda-chuvas pode ser feito por quem não é advogado.",
    },
    {
      blocoId: bloco.id,
      ordem: 1,
      tipo: "macete",
      conteudoMd:
        "## Macete\n\n**P.C.A.D.** — Postular, Consultar, Assessorar, Dirigir.\n\nTudo fora disso **não é privativo** (ex.: pleitos administrativos não judiciais, redação de contratos simples por não-advogado, etc.).",
    },
    {
      blocoId: bloco.id,
      ordem: 2,
      tipo: "pegadinha",
      conteudoMd:
        "## Pegadinha clássica\n\n**Juizado Especial Cível de pequena causa (até 20 salários-mínimos)** permite a parte comparecer SEM advogado em 1ª instância (Lei 9.099/95 art. 9º).\n\nIsso **não** retira o caráter privativo da postulação — significa apenas que a lei dispensou o advogado nesse recorte específico. Em recurso, advogado é obrigatório.",
    },
    {
      blocoId: bloco.id,
      ordem: 3,
      tipo: "exemplo",
      conteudoMd:
        "## Na prática do escritório\n\nUm contador que redige uma defesa em processo administrativo fiscal **pode** fazê-lo — processo administrativo não é atividade privativa.\n\nMas se esse mesmo contador quiser ajuizar mandado de segurança contra o lançamento, aí ele **precisa** de advogado. Postulação em juízo é privativa.",
    },
  ]);

  console.log("5/5 Criando questões e cartões...");
  // Remove questões antigas do bloco e insere do zero
  await db.delete(questoes).where(eq(questoes.blocoId, bloco.id));
  await db.insert(questoes).values([
    {
      blocoId: bloco.id,
      enunciado:
        "Sobre as atividades privativas de advogado (EAOAB art. 1º), assinale a alternativa CORRETA:",
      alternativas: [
        {
          chave: "A",
          texto: "A postulação em juízo é sempre privativa, inclusive em juizados especiais de pequena causa em 1ª instância.",
        },
        {
          chave: "B",
          texto: "A consultoria jurídica é privativa de advogado, mas a redação de contratos simples por terceiros não configura usurpação.",
        },
        {
          chave: "C",
          texto: "A defesa em processo administrativo fiscal é atividade privativa de advogado.",
        },
        {
          chave: "D",
          texto: "A assessoria jurídica deixou de ser atividade privativa após a Reforma Trabalhista de 2017.",
        },
      ],
      correta: "B",
      comentario:
        "A alternativa B é a correta. A Lei 9.099/95 excepciona a postulação em juizados especiais de pequena causa em 1ª instância, afastando o item A. Processo administrativo não é atividade privativa (item C errado). A Reforma Trabalhista não alterou o art. 1º do EAOAB (item D errado).",
      tags: ["etica", "atividades-privativas", "eaoab-art1"],
      nivel: 2,
      leiReferencia: "EAOAB art. 1º; Lei 9.099/95 art. 9º",
      status: "publicado",
    },
    {
      blocoId: bloco.id,
      enunciado:
        "João, bacharel em Direito ainda sem inscrição na OAB, elabora um parecer jurídico consultivo para um amigo. A conduta de João:",
      alternativas: [
        { chave: "A", texto: "É lícita, pois pareceres consultivos não são atividade privativa." },
        { chave: "B", texto: "É lícita, desde que não cobre honorários." },
        { chave: "C", texto: "Configura exercício ilegal da advocacia, independentemente de remuneração." },
        { chave: "D", texto: "É lícita, pois João é bacharel em Direito." },
      ],
      correta: "C",
      comentario:
        "Consultoria jurídica é atividade privativa de advogado (EAOAB art. 1º II). Ser bacharel sem inscrição na OAB não autoriza a prática. A gratuidade e o parentesco/amizade não descaracterizam o exercício ilegal.",
      tags: ["etica", "atividades-privativas", "exercicio-ilegal"],
      nivel: 2,
      leiReferencia: "EAOAB art. 1º II; CP art. 47 (contravenção)",
      status: "publicado",
    },
  ]);

  await db.delete(cartoes).where(eq(cartoes.blocoId, bloco.id));
  await db.insert(cartoes).values([
    {
      blocoId: bloco.id,
      frente: "Quais são as duas atividades privativas de advogado?",
      verso:
        "1) Postulação a qualquer órgão do Poder Judiciário e juizados especiais; 2) Consultoria, assessoria e direção jurídicas. (EAOAB art. 1º)",
      tags: ["etica", "atividades-privativas"],
      status: "publicado",
    },
    {
      blocoId: bloco.id,
      frente: "Em juizado especial cível de pequena causa, a postulação sem advogado é...?",
      verso:
        "Permitida APENAS em 1ª instância, para causas de até 20 salários-mínimos (Lei 9.099/95 art. 9º). Em recurso, advogado é obrigatório.",
      tags: ["etica", "juizados"],
      status: "publicado",
    },
  ]);

  console.log("\nTudo pronto!");
  console.log(`  Bloco de teste: /estudo/etica/${bloco.id}`);
  console.log("  Status: publicado (visível a qualquer logado)");
  process.exit(0);
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
