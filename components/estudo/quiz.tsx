"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { responderQuestao } from "@/lib/estudo/actions";

type Alternativa = { chave: string; texto: string };

type QuizProps = {
  questaoId: string;
  enunciado: string;
  alternativas: Alternativa[];
  onContinuar: () => void;
};

export function Quiz({ questaoId, enunciado, alternativas, onContinuar }: QuizProps) {
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [resultado, setResultado] = useState<
    { acertou: boolean; correta: string; comentario: string | null } | null
  >(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function submeter() {
    if (!escolhida || resultado) return;
    setErro(null);
    startTransition(async () => {
      const r = await responderQuestao(questaoId, escolhida);
      if (!r.ok) {
        setErro(r.erro);
        return;
      }
      setResultado(r.data!);
    });
  }

  return (
    <article className="max-w-2xl space-y-5">
      <p className="font-mono text-xs text-muted uppercase tracking-widest flex items-center gap-2">
        <span aria-hidden>✍️</span>
        Questão
      </p>

      <h3 className="text-lg leading-relaxed">{enunciado}</h3>

      <div className="space-y-2">
        {alternativas.map((alt) => {
          const selecionada = escolhida === alt.chave;
          const marcadaCorreta = resultado && resultado.correta === alt.chave;
          const marcadaErrada =
            resultado && selecionada && !resultado.acertou;
          return (
            <button
              key={alt.chave}
              type="button"
              disabled={!!resultado}
              onClick={() => setEscolhida(alt.chave)}
              className={`w-full flex items-start gap-3 p-3 text-left rounded-[10px] border-2 transition-all disabled:cursor-default ${
                marcadaCorreta
                  ? "border-mint bg-mint/40"
                  : marcadaErrada
                    ? "border-red-500 bg-red-50"
                    : selecionada
                      ? "border-blue bg-lavender"
                      : "border-line bg-white dark:bg-navy-2 hover:border-blue"
              }`}
            >
              <span className="font-display font-bold text-navy w-6">
                {alt.chave}
              </span>
              <span className="flex-1 text-sm">{alt.texto}</span>
            </button>
          );
        })}
      </div>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}

      {resultado && (
        <div
          className={`p-4 rounded-[14px] ${
            resultado.acertou ? "bg-mint" : "bg-red-50"
          }`}
        >
          <p className="font-display font-bold text-lg text-navy mb-2">
            {resultado.acertou
              ? "✓ Acertou"
              : `✗ A correta era ${resultado.correta}`}
          </p>
          {resultado.comentario && (
            <p className="text-sm text-navy leading-relaxed">
              {resultado.comentario}
            </p>
          )}
          {!resultado.acertou && (
            <p className="text-xs text-navy/70 mt-3">
              Esta questão volta para você amanhã na revisão.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        {resultado ? (
          <Button onClick={onContinuar}>Continuar</Button>
        ) : (
          <Button onClick={submeter} disabled={!escolhida || pendente}>
            {pendente ? "Verificando..." : "Responder"}
          </Button>
        )}
      </div>
    </article>
  );
}
