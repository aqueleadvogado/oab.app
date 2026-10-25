import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ETIQUETAS: Record<string, { rotulo: string; emoji: string }> = {
  mapa: { rotulo: "Mapa", emoji: "🗺️" },
  macete: { rotulo: "Macete", emoji: "🔑" },
  pegadinha: { rotulo: "Pegadinha", emoji: "⚠️" },
  exemplo: { rotulo: "Exemplo", emoji: "💼" },
  texto: { rotulo: "Leitura", emoji: "📖" },
  questao: { rotulo: "Questão", emoji: "✍️" },
};

export function PassoTexto({
  tipo,
  conteudoMd,
}: {
  tipo: string;
  conteudoMd: string;
}) {
  const etq = ETIQUETAS[tipo] ?? { rotulo: tipo, emoji: "📄" };
  return (
    <article className="max-w-2xl">
      <p className="font-mono text-xs text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
        <span aria-hidden>{etq.emoji}</span>
        {etq.rotulo}
      </p>
      <div className="prose-oab">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{conteudoMd}</ReactMarkdown>
      </div>
    </article>
  );
}
