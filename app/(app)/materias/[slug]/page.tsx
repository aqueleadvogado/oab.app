import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { carregarDetalheDisciplina } from "@/lib/materias/detalhe";
import { disciplinaPorSlug } from "@/lib/disciplinas-estaticas";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, BookOpen, ListChecks, Target } from "lucide-react";

export const instant = false;

export default async function MateriaDetalhePage({
  params,
}: PageProps<"/materias/[slug]">) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/materias/${slug}`);

  const meta = disciplinaPorSlug(slug);
  const data = await carregarDetalheDisciplina(slug, user.id);
  if (!data || !meta) notFound();

  const acerto =
    data.respostasUsuario > 0
      ? Math.round((data.acertosUsuario / data.respostasUsuario) * 100)
      : null;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full space-y-8">
      <header
        className="rounded-[14px] p-6 text-white"
        style={{ background: meta.corHex }}
      >
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Matéria · {meta.peso} questões/prova
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-4xl" aria-hidden>
            {meta.emoji}
          </span>
          <h1 className="text-3xl md:text-4xl">{meta.nome}</h1>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icone={<BookOpen className="size-4" />}
          valor={data.blocosPublicados.length}
          rotulo="blocos para estudar"
        />
        <StatCard
          icone={<ListChecks className="size-4" />}
          valor={data.totalQuestoes}
          rotulo="questões FGV"
        />
        <StatCard
          icone={<Target className="size-4" />}
          valor={data.topicos.length}
          rotulo="tópicos no edital"
        />
        <StatCard
          icone={<Timer className="size-4" />}
          valor={acerto !== null ? `${acerto}%` : "—"}
          rotulo={
            acerto !== null
              ? `${data.respostasUsuario} resp.`
              : "sem respostas"
          }
        />
      </section>

      {data.blocosPublicados.length > 0 && (
        <section>
          <h2 className="text-xl mb-3">Blocos publicados</h2>
          <ul className="space-y-3">
            {data.blocosPublicados.map((b) => (
              <li
                key={b.id}
                className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{ background: meta.corHex }}
                  aria-hidden
                />
                <Link
                  href={`/estudo/${meta.slug}/${b.id}`}
                  className="pl-5 pr-4 py-4 flex items-center justify-between gap-4 hover:bg-lavender/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                      {b.topicoNome}
                    </p>
                    <h3 className="mt-1 text-lg leading-snug">{b.titulo}</h3>
                    <p className="mt-1 text-sm font-mono text-muted">
                      ⏱ {b.duracaoMin} min
                    </p>
                  </div>
                  <span className="font-mono text-xs text-blue font-bold shrink-0">
                    começar →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-xl mb-3">Tópicos do edital</h2>
        <p className="text-sm text-muted mb-3">
          Estrutura prevista para a matéria. Alguns tópicos ainda estão
          aguardando blocos didáticos ou revisão.
        </p>
        <ul className="space-y-2">
          {data.topicos.map((t) => (
            <li
              key={t.id}
              className="px-4 py-3 rounded-[10px] bg-white dark:bg-navy-2 border border-line"
            >
              <p className="font-display font-bold text-navy">{t.nome}</p>
              {t.leiReferencia && (
                <p className="text-xs font-mono text-muted mt-1">
                  {t.leiReferencia}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {data.totalQuestoes > 0 && (
        <section>
          <Card>
            <CardBody>
              <h2 className="text-xl mb-2">Treinar com questões FGV</h2>
              <p className="text-muted mb-4">
                Você tem {data.totalQuestoes} questões reais da FGV
                classificadas como {meta.nome}. Em breve você poderá filtrar
                simulados só desta matéria.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/simulados">Ver simulados completos</Link>
              </Button>
            </CardBody>
          </Card>
        </section>
      )}

      <p className="text-center">
        <Link href="/materias" className="text-sm text-blue hover:underline font-bold">
          ← Voltar para todas as matérias
        </Link>
      </p>
    </main>
  );
}

function StatCard({
  icone,
  valor,
  rotulo,
}: {
  icone: React.ReactNode;
  valor: number | string;
  rotulo: string;
}) {
  return (
    <div className="bg-white dark:bg-navy-2 border border-line rounded-[10px] px-3 py-3">
      <div className="flex items-center gap-1.5 text-muted">
        {icone}
        <span className="font-mono text-[10px] uppercase tracking-widest">
          {rotulo}
        </span>
      </div>
      <p className="font-display text-2xl font-bold text-navy mt-1">{valor}</p>
    </div>
  );
}
