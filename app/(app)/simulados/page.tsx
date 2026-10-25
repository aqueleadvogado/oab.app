import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listarSimuladosFgv } from "@/lib/estudo/queries";
import { Timer, ListChecks } from "lucide-react";

export const metadata = { title: "Simulados" };
export const instant = false;

export default async function SimuladosPage() {
  const simulados = await listarSimuladosFgv();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full space-y-8">
      <header>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Simulados
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Treine com provas reais</h1>
        <p className="mt-2 text-muted">
          Exames anteriores do Exame de Ordem Unificado aplicados pela FGV, com
          gabarito oficial. Enquanto o motor de simulado completo ainda não está
          pronto (feedback só no final, cronômetro de 5h), você já pode treinar
          questão por questão com feedback imediato.
        </p>
      </header>

      {simulados.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-muted">Nenhum simulado disponível ainda.</p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-3">
          {simulados.map((s) => (
            <li
              key={s.blocoId}
              className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-2 bg-navy"
                aria-hidden
              />
              <div className="pl-5 pr-4 py-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Prova FGV
                </p>
                <h3 className="mt-1 text-lg leading-snug">{s.titulo}</h3>
                {s.resumo && (
                  <p className="mt-2 text-sm text-muted">{s.resumo}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm font-mono text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="size-4" aria-hidden /> {s.totalQuestoes}{" "}
                    questões
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Timer className="size-4" aria-hidden /> {s.duracaoMin} min
                    (tempo oficial)
                  </span>
                </div>
                <div className="mt-4">
                  <Button asChild>
                    <Link
                      href={`/estudo/${s.disciplinaSlug}/${s.blocoId}`}
                    >
                      Começar a treinar
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted">
        Fonte: provas oficiais do Exame de Ordem Unificado, aplicadas pela FGV
        em convênio com o Conselho Federal da OAB. OAB em Blocos é plataforma
        independente, sem vínculo com o CFOAB ou com a FGV.
      </p>
    </main>
  );
}
