"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { responderRevisao } from "@/lib/revisao/actions";
import type { ItemRevisao } from "@/lib/revisao/queries";
import type { AvaliacaoRevisao } from "@/lib/revisao/sm2";

const AVALIACOES: {
  valor: AvaliacaoRevisao;
  rotulo: string;
  descricao: string;
  cor: string;
}[] = [
  { valor: "esqueci", rotulo: "Esqueci", descricao: "amanhã", cor: "bg-red-500 text-white" },
  { valor: "dificil", rotulo: "Difícil", descricao: "em breve", cor: "bg-amber-300 text-navy" },
  { valor: "bom", rotulo: "Bom", descricao: "normal", cor: "bg-blue text-white" },
  { valor: "facil", rotulo: "Fácil", descricao: "mais tarde", cor: "bg-mint text-navy" },
];

export function SessaoRevisao({ fila }: { fila: ItemRevisao[] }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [mostrarVerso, setMostrarVerso] = useState(false);
  const [pendente, startTransition] = useTransition();

  if (i >= fila.length) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 space-y-3">
            <div className="mx-auto size-16 rounded-full bg-mint flex items-center justify-center text-3xl">
              ✓
            </div>
            <h2 className="text-2xl">Revisão do dia feita</h2>
            <p className="text-muted">
              Volte amanhã — ou vá estudar algo novo na Trilha.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => router.push("/trilha")}>
                Ir para a Trilha
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const atual = fila[i];

  function avaliar(valor: AvaliacaoRevisao) {
    startTransition(async () => {
      await responderRevisao(atual.revisaoId, valor);
      setMostrarVerso(false);
      setI(i + 1);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted">
          {i + 1} de {fila.length}
        </span>
        {atual.disciplinaNome && (
          <span
            className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-full text-navy"
            style={{
              background: `var(--color-${atual.disciplinaCor ?? "lavender"})`,
            }}
          >
            {atual.disciplinaNome}
          </span>
        )}
      </div>

      <Card>
        <CardBody>
          {atual.tipo === "cartao" && atual.cartao && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
                  Pergunta
                </p>
                <p className="text-lg leading-relaxed">{atual.cartao.frente}</p>
              </div>
              {!mostrarVerso ? (
                <div className="flex justify-center pt-2">
                  <Button onClick={() => setMostrarVerso(true)}>
                    Mostrar resposta
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t border-line">
                  <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
                    Resposta
                  </p>
                  <p className="text-base leading-relaxed">{atual.cartao.verso}</p>
                </div>
              )}
            </div>
          )}

          {atual.tipo === "questao" && atual.questao && (
            <div className="space-y-5">
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
                  Questão errada antes
                </p>
                <p className="text-base leading-relaxed">
                  {atual.questao.enunciado}
                </p>
              </div>
              {!mostrarVerso ? (
                <div className="flex justify-center pt-2">
                  <Button onClick={() => setMostrarVerso(true)}>
                    Ver resposta correta
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t border-line space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="font-display font-bold text-navy w-6">
                      {atual.questao.correta}
                    </span>
                    <p className="text-sm">
                      {
                        atual.questao.alternativas.find(
                          (a) => a.chave === atual.questao!.correta,
                        )?.texto
                      }
                    </p>
                  </div>
                  {atual.questao.comentario && (
                    <p className="text-sm text-muted leading-relaxed">
                      {atual.questao.comentario}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {mostrarVerso && (
        <div className="grid grid-cols-4 gap-2">
          {AVALIACOES.map((a) => (
            <button
              key={a.valor}
              onClick={() => avaliar(a.valor)}
              disabled={pendente}
              className={`py-3 rounded-md font-display font-bold text-sm transition-opacity ${a.cor} disabled:opacity-50 flex flex-col items-center gap-0.5`}
            >
              <span>{a.rotulo}</span>
              <span className="text-[10px] font-mono opacity-80 normal-case">
                {a.descricao}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
