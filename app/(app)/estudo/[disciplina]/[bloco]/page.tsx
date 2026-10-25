import { notFound } from "next/navigation";
import { PlayerBloco } from "@/components/estudo/player-bloco";
import { carregarBlocoCompleto } from "@/lib/estudo/queries";

export const instant = false;

type Alternativa = { chave: string; texto: string };

export default async function BlocoPage({
  params,
}: PageProps<"/estudo/[disciplina]/[bloco]">) {
  const { bloco: blocoId } = await params;
  const data = await carregarBlocoCompleto(blocoId);
  if (!data) notFound();

  return (
    <PlayerBloco
      blocoId={data.bloco.id}
      titulo={data.bloco.titulo}
      disciplinaNome={data.disciplina.nome}
      disciplinaCor={data.disciplina.cor ?? data.disciplina.slug}
      duracaoMin={data.bloco.duracaoMin}
      passos={data.passos.map((p) => ({
        id: p.id,
        tipo: p.tipo,
        conteudoMd: p.conteudoMd,
      }))}
      questoes={data.questoes.map((q) => ({
        id: q.id,
        enunciado: q.enunciado,
        alternativas: q.alternativas as Alternativa[],
      }))}
    />
  );
}
