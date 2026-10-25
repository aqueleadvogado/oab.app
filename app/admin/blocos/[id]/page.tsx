import { notFound } from "next/navigation";
import { carregarBlocoParaRevisao } from "@/lib/admin/queries";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PassoTexto } from "@/components/estudo/passo-texto";
import { BotoesRevisao } from "@/components/admin/botoes-revisao";

export const instant = false;

export default async function AdminBlocoDetalhe({
  params,
}: PageProps<"/admin/blocos/[id]">) {
  const { id } = await params;
  const data = await carregarBlocoParaRevisao(id);
  if (!data) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <header
        className="rounded-[14px] p-5 border border-line bg-white dark:bg-navy-2"
        style={{
          borderLeftWidth: 6,
          borderLeftColor: `var(--color-${data.disciplina.cor ?? data.disciplina.slug})`,
        }}
      >
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          {data.disciplina.nome} · {data.topico.nome}
        </p>
        <h1 className="text-2xl mt-2">{data.bloco.titulo}</h1>
        {data.bloco.resumo && (
          <p className="mt-2 text-muted">{data.bloco.resumo}</p>
        )}
        <div className="mt-3 flex items-center gap-3 text-sm font-mono text-muted">
          <span>{data.bloco.duracaoMin} min</span>
          <span>·</span>
          <span>status: {data.bloco.status}</span>
          <span>·</span>
          <span>{data.passos.length}p · {data.questoes.length}q · {data.cartoes.length}c</span>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl">Passos</h2>
        {data.passos.map((p) => (
          <Card key={p.id}>
            <CardBody>
              <PassoTexto tipo={p.tipo} conteudoMd={p.conteudoMd} />
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Questões</h2>
        {data.questoes.map((q, i) => {
          const alts = q.alternativas as { chave: string; texto: string }[];
          return (
            <Card key={q.id}>
              <CardHeader>
                <p className="font-mono text-xs text-muted uppercase tracking-widest">
                  Questão {i + 1} · gabarito: <strong>{q.correta}</strong>
                </p>
              </CardHeader>
              <CardBody>
                <p className="text-sm mb-4">{q.enunciado}</p>
                <ul className="space-y-2 mb-4">
                  {alts.map((a) => (
                    <li
                      key={a.chave}
                      className={`flex gap-3 p-2 rounded ${
                        a.chave === q.correta
                          ? "bg-mint/40 text-navy font-bold"
                          : ""
                      }`}
                    >
                      <span className="font-display font-bold w-6">{a.chave}</span>
                      <span className="text-sm">{a.texto}</span>
                    </li>
                  ))}
                </ul>
                {q.comentario && (
                  <div className="mt-3 p-3 bg-lavender rounded text-sm">
                    <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
                      Comentário do gabarito
                    </p>
                    <p>{q.comentario}</p>
                  </div>
                )}
                {q.leiReferencia && (
                  <p className="mt-2 font-mono text-xs text-muted">
                    {q.leiReferencia}
                  </p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Cartões de revisão</h2>
        {data.cartoes.map((c, i) => (
          <Card key={c.id}>
            <CardBody>
              <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
                Cartão {i + 1}
              </p>
              <p className="font-bold text-navy mb-2">{c.frente}</p>
              <p className="text-sm text-muted">{c.verso}</p>
            </CardBody>
          </Card>
        ))}
      </section>

      <div className="sticky bottom-0 bg-paper border-t border-line py-4 -mx-6 px-6 flex justify-end">
        <BotoesRevisao blocoId={data.bloco.id} />
      </div>
    </div>
  );
}
