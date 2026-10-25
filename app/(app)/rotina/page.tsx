import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { planoDoDia, sessoes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { CheckInEnergia } from "@/components/rotina/check-in-energia";
import { PlanoDoDiaView } from "@/components/rotina/plano-do-dia-view";
import type { ItemPlano } from "@/lib/plano/gerador";

export const metadata = { title: "Rotina" };
export const instant = false;

function hojeISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default async function RotinaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const data = hojeISO();

  const [sessaoHoje] = await db
    .select({ energia: sessoes.energia })
    .from(sessoes)
    .where(and(eq(sessoes.userId, user!.id), eq(sessoes.data, data)))
    .limit(1);

  const [plano] = await db
    .select({ itens: planoDoDia.itens })
    .from(planoDoDia)
    .where(and(eq(planoDoDia.userId, user!.id), eq(planoDoDia.data, data)))
    .limit(1);

  const itens = (plano?.itens as ItemPlano[]) ?? [];

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full space-y-10">
      <header>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Rotina de hoje
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Como você está?</h1>
        <p className="mt-2 text-muted">
          Sem culpa. Escolha o nível de hoje — o plano se ajusta.
        </p>
      </header>

      <CheckInEnergia selecionada={sessaoHoje?.energia ?? undefined} />

      {itens.length > 0 && <PlanoDoDiaView itens={itens} />}
    </main>
  );
}
