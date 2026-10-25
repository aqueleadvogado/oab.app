type CronometroProps = {
  segundosTotais: number;
  segundosRestantes: number;
  rotulo?: string;
};

/**
 * Prévia visual (sem lógica de contagem) do cronômetro circular.
 * O cronômetro de verdade (baseado em timestamp, resistente a tela bloqueada)
 * entra na Fase 2 junto com o player de blocos.
 */
export function Cronometro({
  segundosTotais,
  segundosRestantes,
  rotulo,
}: CronometroProps) {
  const pct = Math.max(
    0,
    Math.min(100, (segundosRestantes / segundosTotais) * 100),
  );
  const mm = Math.floor(segundosRestantes / 60)
    .toString()
    .padStart(2, "0");
  const ss = (segundosRestantes % 60).toString().padStart(2, "0");

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className="relative size-32 rounded-full"
        style={{
          background: `conic-gradient(var(--color-blue) ${pct}%, var(--color-lavender) 0)`,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-white dark:bg-navy-2 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold text-navy tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>
      {rotulo && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {rotulo}
        </p>
      )}
    </div>
  );
}
