import { createClient } from "@/lib/supabase/server";
import { Card, CardBody } from "@/components/ui/card";
import { listarRevisoesVencidas } from "@/lib/revisao/queries";
import { SessaoRevisao } from "@/components/revisao/sessao-revisao";

export const metadata = { title: "Revisão" };
export const instant = false;

export default async function RevisaoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fila = await listarRevisoesVencidas(user!.id);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 w-full space-y-6">
      <header>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Revisão espaçada
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">
          {fila.length > 0
            ? `${fila.length} item${fila.length > 1 ? "s" : ""} para hoje`
            : "Nada vencido por aqui"}
        </h1>
        <p className="mt-2 text-muted">
          O app recalcula a próxima revisão de cada item conforme você diz
          se foi fácil ou difícil.
        </p>
      </header>

      {fila.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-muted">
              Suas revisões aparecem aqui quando chega a hora. Para popular a
              fila, faça blocos de estudo (os cartões viram revisões) e
              responda questões (as erradas voltam no dia seguinte).
            </p>
          </CardBody>
        </Card>
      ) : (
        <SessaoRevisao fila={fila} />
      )}
    </main>
  );
}
