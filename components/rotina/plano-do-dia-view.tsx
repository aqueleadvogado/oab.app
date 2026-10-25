import { Coffee, Timer } from "lucide-react";
import type { ItemPlano } from "@/lib/plano/gerador";

export function PlanoDoDiaView({ itens }: { itens: ItemPlano[] }) {
  if (!itens.length) return null;

  const totalMin = itens.reduce((acc, i) => acc + i.minutos, 0);

  return (
    <section>
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-widest">
            Seu plano de hoje
          </p>
          <h2 className="text-2xl mt-1">
            {itens.filter((i) => i.tipo === "bloco").length} blocos ·{" "}
            {totalMin} min no total
          </h2>
        </div>
      </header>

      <ol className="space-y-2">
        {itens.map((item, i) => {
          if (item.tipo === "pausa") {
            return (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-[10px] bg-lavender text-muted text-sm"
              >
                <Coffee className="size-4" aria-hidden />
                <span className="font-mono uppercase tracking-widest text-xs">
                  Pausa · {item.minutos} min
                </span>
              </li>
            );
          }
          return (
            <li
              key={i}
              className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-2"
                style={{
                  background: `var(--color-${item.disciplinaSlug ?? "lavender"})`,
                }}
                aria-hidden
              />
              <div className="pl-5 pr-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    {i + 1}º bloco
                  </p>
                  <h3 className="text-base leading-tight mt-0.5">
                    {item.titulo}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-mono text-muted">
                  <Timer className="size-4" aria-hidden />
                  {item.minutos} min
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-xs text-muted">
        O botão para iniciar cada bloco entra junto com o player (próxima
        sub-fase). Até lá, você pode mudar sua energia a qualquer momento e
        o plano é refeito.
      </p>
    </section>
  );
}
