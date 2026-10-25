import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resumoMaterias } from "@/lib/materias/queries";
import { Timer, ListChecks, BookOpen } from "lucide-react";

export const metadata = { title: "Matérias" };
export const instant = false;

export default async function MateriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const materias = await resumoMaterias(user!.id);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 w-full">
      <header className="mb-8">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Matérias
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">
          As 20 disciplinas da 1ª fase
        </h1>
        <p className="mt-2 text-muted">
          Cada cor é a matéria. Toque para ver os blocos disponíveis e seu
          progresso em cada uma.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materias.map((m) => {
          const acerto =
            m.respostasUsuario > 0
              ? Math.round((m.acertosUsuario / m.respostasUsuario) * 100)
              : null;
          return (
            <li key={m.slug}>
              <Link
                href={`/materias/${m.slug}`}
                className="group block relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12] transition-transform hover:-translate-y-0.5"
              >
                <div
                  className="h-24 flex items-start justify-between px-5 pt-4"
                  style={{ background: m.corHex, color: "white" }}
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                      {m.peso} questões/prova
                    </p>
                    <h2 className="text-xl font-display font-bold leading-tight mt-1 max-w-[160px]">
                      {m.nome}
                    </h2>
                  </div>
                  <span className="text-4xl" aria-hidden>
                    {m.emoji}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <BookOpen className="size-4 shrink-0" aria-hidden />
                    <span>
                      {m.blocosPublicados} bloco
                      {m.blocosPublicados === 1 ? "" : "s"} publicado
                      {m.blocosPublicados === 1 ? "" : "s"}
                      {m.blocosEmRevisao > 0 &&
                        ` · +${m.blocosEmRevisao} em revisão`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <ListChecks className="size-4 shrink-0" aria-hidden />
                    <span>
                      {m.questoesClassificadas} questões FGV disponíveis
                    </span>
                  </div>
                  {acerto !== null && (
                    <div className="flex items-center gap-2 text-navy font-bold pt-1">
                      <Timer className="size-4 shrink-0" aria-hidden />
                      <span>
                        Seu acerto: {acerto}%{" "}
                        <span className="font-normal text-muted">
                          ({m.respostasUsuario} resp.)
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
