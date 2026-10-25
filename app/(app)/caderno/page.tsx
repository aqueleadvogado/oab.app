import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import {
  respostas,
  questoes,
  blocos,
  topicos,
  disciplinas,
} from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Caderno de erros" };
export const instant = false;

export default async function CadernoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const erros = await db
    .select({
      questaoId: questoes.id,
      enunciado: questoes.enunciado,
      correta: questoes.correta,
      comentario: questoes.comentario,
      disciplinaNome: disciplinas.nome,
      disciplinaCor: disciplinas.cor,
      disciplinaSlug: disciplinas.slug,
      blocoTitulo: blocos.titulo,
      quando: respostas.criadoEm,
    })
    .from(respostas)
    .innerJoin(questoes, eq(respostas.questaoId, questoes.id))
    .leftJoin(blocos, eq(questoes.blocoId, blocos.id))
    .leftJoin(topicos, eq(blocos.topicoId, topicos.id))
    .leftJoin(disciplinas, eq(topicos.disciplinaId, disciplinas.id))
    .where(and(eq(respostas.userId, user!.id), eq(respostas.acertou, false)))
    .orderBy(desc(respostas.criadoEm))
    .limit(50);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full space-y-6">
      <header>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Caderno
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Caderno de erros</h1>
        <p className="mt-2 text-muted">
          As questões que você errou mais recentemente ficam aqui para
          você revisar. Cada erro também entra na fila da revisão espaçada.
        </p>
      </header>

      {erros.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-muted">
              Nenhum erro por aqui ainda — ou você acerta tudo, ou ainda
              não respondeu questões. Vá para a Trilha e abra um bloco.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-3">
          {erros.map((e) => (
            <li
              key={`${e.questaoId}-${e.quando.toISOString()}`}
              className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-2"
                style={{
                  background: `var(--color-${e.disciplinaCor ?? e.disciplinaSlug ?? "lavender"})`,
                }}
                aria-hidden
              />
              <div className="pl-5 pr-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  {e.disciplinaNome ?? "—"} · {e.blocoTitulo ?? "sem bloco"}
                </p>
                <p className="mt-2 text-sm leading-relaxed">{e.enunciado}</p>
                <p className="mt-3 text-xs text-muted">
                  Resposta correta: <strong>{e.correta}</strong>
                </p>
                {e.comentario && (
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {e.comentario}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
