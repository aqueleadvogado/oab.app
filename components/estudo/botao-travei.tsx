"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function BotaoTravei({ onReiniciar }: { onReiniciar: () => void }) {
  const [aberto, setAberto] = useState(false);

  if (aberto) {
    return (
      <div className="fixed bottom-24 md:bottom-6 left-6 z-40 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-navy-2 rounded-[14px] border-2 border-blue shadow-[0_18px_48px_#1b2b4b25] p-5">
        <p className="font-display font-bold text-navy mb-2">Travou?</p>
        <p className="text-sm text-muted mb-4">
          Sem drama. Vamos recomeçar o bloco com menos conteúdo e cronômetro
          de 5 minutos. Se não der, volta pra Trilha e escolhe outro.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setAberto(false)}
            className="px-3 py-1.5 text-sm text-muted hover:text-ink"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              setAberto(false);
              onReiniciar();
            }}
            className="px-4 py-1.5 text-sm font-bold font-display bg-blue text-white rounded-md"
          >
            Recomeçar fácil
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setAberto(true)}
      className="fixed bottom-24 md:bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-navy-2 border border-line rounded-full shadow-[0_18px_48px_#1b2b4b12] text-sm font-bold font-display text-navy hover:bg-lavender transition-colors"
      aria-label="Travei no bloco"
    >
      <AlertTriangle className="size-4 text-eleitoral" aria-hidden />
      Travei
    </button>
  );
}
