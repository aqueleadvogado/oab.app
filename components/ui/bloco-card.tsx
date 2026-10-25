type BlocoCardProps = {
  disciplina: string;
  cor: string; // ex.: "etica", "civil" — precisa existir como --color-{cor}
  titulo: string;
  minutos: number;
  concluido?: boolean;
};

export function BlocoCard({
  disciplina,
  cor,
  titulo,
  minutos,
  concluido = false,
}: BlocoCardProps) {
  // Faixa colorida à esquerda é a identidade visual central do produto.
  return (
    <article
      className="relative overflow-hidden rounded-[14px] bg-white dark:bg-navy-2 border border-line shadow-[0_18px_48px_#1b2b4b12] transition-transform hover:-translate-y-0.5"
      style={{ "--tint": `var(--color-${cor})` } as React.CSSProperties}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{ background: "var(--tint)" }}
        aria-hidden
      />
      <div className="pl-5 pr-4 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {disciplina}
        </p>
        <h3 className="mt-1 text-lg leading-snug">{titulo}</h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-mono text-muted">⏱ {minutos} min</span>
          {concluido && (
            <span className="font-bold text-blue">✓ concluído</span>
          )}
        </div>
      </div>
    </article>
  );
}
