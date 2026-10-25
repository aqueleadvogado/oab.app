import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listarBlocosPublicados } from "@/lib/estudo/queries";
import { Timer } from "lucide-react";

export const metadata = { title: "Trilha" };
export const instant = false;

export default async function TrilhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [perfil] = await db
    .select({ nome: profiles.nome })
    .from(profiles)
    .where(eq(profiles.id, user!.id))
    .limit(1);

  const blocos = await listarBlocosPublicados();
  const nome = perfil?.nome ?? user!.email?.split("@")[0] ?? "";

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full space-y-10">
      <header>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Minha trilha
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Oi, {nome} 👋</h1>
        <p className="mt-2 text-muted">
          Comece pelo check-in de energia na Rotina, ou abra um bloco
          direto aqui.
        </p>
      </header>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl">Blocos disponíveis</h2>
          <Link
            href="/rotina"
            className="text-sm font-bold text-blue hover:underline"
          >
            Ir pra Rotina →
          </Link>
        </div>

        {blocos.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-muted">
                Nenhum bloco publicado ainda. O conteúdo real das 20
                disciplinas entra na Fase 5.
              </p>
            </CardBody>
          </Card>
        ) : (
          <ul className="space-y-3">
            {blocos.map((b) => (
              <li
                key={b.blocoId}
                className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{ background: `var(--color-${b.cor ?? b.disciplinaSlug})` }}
                  aria-hidden
                />
                <div className="pl-5 pr-4 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                      {b.disciplinaNome} · {b.topicoNome}
                    </p>
                    <h3 className="mt-1 text-lg leading-snug">{b.titulo}</h3>
                    <p className="mt-2 text-sm font-mono text-muted inline-flex items-center gap-1.5">
                      <Timer className="size-3.5" aria-hidden /> {b.duracaoMin} min
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/estudo/${b.disciplinaSlug}/${b.blocoId}`}>
                      Começar
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
