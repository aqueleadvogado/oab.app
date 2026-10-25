"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PassoTexto } from "@/components/estudo/passo-texto";
import { Quiz } from "@/components/estudo/quiz";
import { BotaoTravei } from "@/components/estudo/botao-travei";
import { concluirBloco } from "@/lib/estudo/actions";

type PassoLite = { id: string; tipo: string; conteudoMd: string };
type QuestaoLite = {
  id: string;
  enunciado: string;
  alternativas: { chave: string; texto: string }[];
};

type Props = {
  blocoId: string;
  titulo: string;
  disciplinaNome: string;
  disciplinaCor: string;
  disciplinaSlug: string;
  duracaoMin: number;
  passos: PassoLite[];
  questoes: QuestaoLite[];
};

export function PlayerBloco({
  blocoId,
  titulo,
  disciplinaNome,
  disciplinaCor,
  disciplinaSlug,
  duracaoMin,
  passos,
  questoes,
}: Props) {
  const router = useRouter();
  // Lista unificada: primeiro todos os passos (mapa/macete/etc), depois cada questão
  const sequencia: Array<
    { kind: "passo"; passo: PassoLite } | { kind: "questao"; questao: QuestaoLite }
  > = [
    ...passos.map((p) => ({ kind: "passo" as const, passo: p })),
    ...questoes.map((q) => ({ kind: "questao" as const, questao: q })),
  ];

  const [i, setI] = useState(0);
  const [finalizando, startTransition] = useTransition();
  const total = sequencia.length;
  const atual = sequencia[i];
  const pct = ((i + 1) / total) * 100;

  function avancar() {
    if (i < total - 1) setI(i + 1);
    else finalizarBloco();
  }

  function finalizarBloco() {
    startTransition(async () => {
      await concluirBloco(blocoId, duracaoMin);
      router.push(`/estudo/${disciplinaSlug}/${blocoId}/concluido`);
    });
  }

  function reiniciar() {
    setI(0);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header
        className="border-b border-line px-6 py-3 flex items-center gap-3"
        style={{ borderBottomColor: `var(--color-${disciplinaCor})`, borderBottomWidth: 4 }}
      >
        <Link
          href="/trilha"
          className="shrink-0 size-8 flex items-center justify-center rounded-md hover:bg-lavender"
          aria-label="Voltar para a trilha"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest truncate">
            {disciplinaNome}
          </p>
          <h2 className="text-sm font-bold truncate">{titulo}</h2>
        </div>
        <p className="font-mono text-xs text-muted shrink-0">
          {i + 1} / {total}
        </p>
      </header>

      <div className="h-1 bg-line">
        <div
          className="h-full bg-blue transition-all"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {atual.kind === "passo" ? (
            <>
              <PassoTexto tipo={atual.passo.tipo} conteudoMd={atual.passo.conteudoMd} />
              <div className="mt-10 flex justify-end">
                <Button size="lg" onClick={avancar}>
                  {i < total - 1 ? "Próximo" : "Finalizar"}
                </Button>
              </div>
            </>
          ) : (
            // key força React a remontar (resetar escolhida e resultado) a cada troca de questão
            <Quiz
              key={atual.questao.id}
              questaoId={atual.questao.id}
              enunciado={atual.questao.enunciado}
              alternativas={atual.questao.alternativas}
              onContinuar={avancar}
            />
          )}
        </div>
      </main>

      <BotaoTravei onReiniciar={reiniciar} />

      {finalizando && (
        <div className="fixed inset-0 bg-paper/90 flex items-center justify-center z-50">
          <div className="flex items-center gap-3 text-navy font-display font-bold">
            <Check className="size-6 text-blue" aria-hidden />
            Salvando progresso...
          </div>
        </div>
      )}
    </div>
  );
}
