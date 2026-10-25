"use client";

import { useState, useTransition } from "react";
import { fazerCheckIn } from "@/lib/rotina/actions";

type Opcao = {
  valor: "verde" | "amarelo" | "vermelho";
  rotulo: string;
  descricao: string;
  emoji: string;
  cor: string;
};

const OPCOES: Opcao[] = [
  {
    valor: "verde",
    rotulo: "Verde",
    descricao: "Hoje aguento um plano maior.",
    emoji: "💚",
    cor: "mint",
  },
  {
    valor: "amarelo",
    rotulo: "Amarelo",
    descricao: "Dá para estudar, mas sem exagero.",
    emoji: "💛",
    cor: "empresarial",
  },
  {
    valor: "vermelho",
    rotulo: "Vermelho",
    descricao: "Pouco combustível. Vamos de básico.",
    emoji: "❤️",
    cor: "eleitoral",
  },
];

export function CheckInEnergia({ selecionada }: { selecionada?: string }) {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function onEnergia(valor: Opcao["valor"]) {
    const fd = new FormData();
    fd.append("energia", valor);
    setErro(null);
    startTransition(async () => {
      const r = await fazerCheckIn(fd);
      if (!r.ok) setErro(r.erro);
    });
  }

  return (
    <div className="space-y-3">
      {OPCOES.map((opt) => {
        const ativa = selecionada === opt.valor;
        return (
          <button
            key={opt.valor}
            type="button"
            onClick={() => onEnergia(opt.valor)}
            disabled={pendente}
            className={`w-full flex items-center gap-4 p-4 rounded-[14px] border-2 transition-all text-left disabled:opacity-60 ${
              ativa
                ? "border-blue bg-lavender"
                : "border-line bg-white dark:bg-navy-2 hover:border-blue"
            }`}
            style={{ borderLeftColor: `var(--color-${opt.cor})`, borderLeftWidth: 8 }}
          >
            <span className="text-3xl" aria-hidden>
              {opt.emoji}
            </span>
            <div className="flex-1">
              <div className="font-display font-bold text-lg text-navy">
                {opt.rotulo}
              </div>
              <div className="text-sm text-muted">{opt.descricao}</div>
            </div>
            {ativa && (
              <span className="font-mono text-xs uppercase tracking-widest text-blue font-bold">
                hoje
              </span>
            )}
          </button>
        );
      })}
      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}
    </div>
  );
}
