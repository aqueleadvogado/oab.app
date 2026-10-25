/**
 * SM-2 simplificado (Anki-like), 4 botões:
 *   esqueci  — reinicia (intervalo = 1 dia, lapsos++, fator -0.20)
 *   dificil  — intervalo /2 (mín 1), fator -0.15
 *   bom      — intervalo * fator (padrão)
 *   facil    — intervalo * fator * 1.3, fator +0.15
 *
 * Fator inicial 2.5. Mínimo 1.3. Lapso incrementa contador.
 */

export type AvaliacaoRevisao = "esqueci" | "dificil" | "bom" | "facil";

export type EstadoRevisao = {
  fator: number; // ex: 2.50
  intervaloDias: number;
  lapsos: number;
};

export function avaliar(
  estado: EstadoRevisao,
  avaliacao: AvaliacaoRevisao,
): EstadoRevisao {
  let { fator, intervaloDias, lapsos } = estado;

  switch (avaliacao) {
    case "esqueci":
      lapsos += 1;
      fator = Math.max(1.3, fator - 0.2);
      intervaloDias = 1;
      break;
    case "dificil":
      fator = Math.max(1.3, fator - 0.15);
      intervaloDias = Math.max(1, Math.round(intervaloDias / 2));
      break;
    case "bom":
      intervaloDias = Math.max(1, Math.round(intervaloDias * fator));
      break;
    case "facil":
      fator = Math.min(3.0, fator + 0.15);
      intervaloDias = Math.max(1, Math.round(intervaloDias * fator * 1.3));
      break;
  }

  return { fator, intervaloDias, lapsos };
}

export function proximaDueDate(intervaloDias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + intervaloDias);
  // Padroniza às 03:00 UTC para ficar no fim do dia local do Brasil
  d.setUTCHours(3, 0, 0, 0);
  return d;
}
