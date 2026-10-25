import Link from "next/link";
import { listarBlocosPorStatus } from "@/lib/admin/queries";
import { Card, CardBody } from "@/components/ui/card";

export const instant = false;

export default async function AdminBlocosPage() {
  const emRevisao = await listarBlocosPorStatus(["em_revisao", "aprovado"]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <header>
        <h1 className="text-3xl">Blocos em revisão</h1>
        <p className="text-muted mt-2">
          {emRevisao.length} bloco{emRevisao.length === 1 ? "" : "s"} aguardando sua aprovação.
        </p>
      </header>

      {emRevisao.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-muted">Fila limpa. Nenhum bloco em revisão.</p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-3">
          {emRevisao.map((b) => (
            <li
              key={b.id}
              className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12]"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-2"
                style={{ background: `var(--color-${b.disciplinaCor ?? b.disciplinaSlug})` }}
                aria-hidden
              />
              <Link
                href={`/admin/blocos/${b.id}`}
                className="pl-5 pr-4 py-4 flex items-center gap-4 hover:bg-lavender/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    {b.disciplinaNome} · {b.topicoNome}
                  </p>
                  <h3 className="text-lg leading-tight mt-1">{b.titulo}</h3>
                  {b.resumo && (
                    <p className="mt-1 text-sm text-muted line-clamp-2">
                      {b.resumo}
                    </p>
                  )}
                </div>
                <span className="font-mono text-xs text-blue font-bold shrink-0">
                  revisar →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
