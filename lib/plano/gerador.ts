import { DISCIPLINAS_ESTATICAS } from "@/lib/disciplinas-estaticas";

export type ItemPlano = {
  tipo: "bloco" | "pausa" | "revisao";
  blocoId?: string;
  titulo?: string;
  disciplinaSlug?: string;
  minutos: number;
};

export type EnergiaValor = "verde" | "amarelo" | "vermelho";

const RECEITA_POR_ENERGIA: Record<
  EnergiaValor,
  { quantidadeBlocos: number; minutosPorBloco: number; incluirPausa: boolean }
> = {
  verde: { quantidadeBlocos: 4, minutosPorBloco: 20, incluirPausa: true },
  amarelo: { quantidadeBlocos: 4, minutosPorBloco: 15, incluirPausa: true },
  vermelho: { quantidadeBlocos: 2, minutosPorBloco: 10, incluirPausa: false },
};

/**
 * Gera plano do dia (versão simplificada — até o banco ter blocos reais).
 * Escolhe disciplinas prioritárias do aluno, ou disciplinas de maior peso
 * (Ética, Civil, Processo Civil, Constitucional, Penal) se o aluno ainda
 * não escolheu prioridades.
 */
export function gerarPlanoDoDia(
  energia: EnergiaValor,
  materiasPrioritarias: string[],
): ItemPlano[] {
  const receita = RECEITA_POR_ENERGIA[energia];
  const pool = selecionarDisciplinas(materiasPrioritarias, receita.quantidadeBlocos);

  const itens: ItemPlano[] = [];
  for (let i = 0; i < receita.quantidadeBlocos; i++) {
    const d = pool[i % pool.length];
    itens.push({
      tipo: "bloco",
      titulo: `Bloco de ${d.nome}`,
      disciplinaSlug: d.slug,
      minutos: receita.minutosPorBloco,
    });
    if (
      receita.incluirPausa &&
      i < receita.quantidadeBlocos - 1 &&
      (i + 1) % 2 === 0
    ) {
      itens.push({ tipo: "pausa", titulo: "Pausa curta", minutos: 5 });
    }
  }
  return itens;
}

function selecionarDisciplinas(prioritarias: string[], quantidade: number) {
  const porSlug = new Map(DISCIPLINAS_ESTATICAS.map((d) => [d.slug, d]));
  const escolhidas = prioritarias
    .map((s) => porSlug.get(s))
    .filter(Boolean) as typeof DISCIPLINAS_ESTATICAS;

  if (escolhidas.length >= quantidade) return escolhidas;

  // Completa com as de maior peso que ainda não entraram.
  const fallback = DISCIPLINAS_ESTATICAS.slice()
    .sort((a, b) => b.peso - a.peso)
    .filter((d) => !escolhidas.some((e) => e.slug === d.slug));

  return [...escolhidas, ...fallback].slice(0, quantidade);
}
