/**
 * Lista das 20 disciplinas da 1ª fase do Exame de Ordem.
 *
 * Paleta temática — cada disciplina tem cor única, com significado:
 *   Ética → azul royal (profissionalismo)
 *   Civil → coral (vida/família)
 *   Processo Civil → azul claro (fluxo processual)
 *   Constitucional → verde-oliva (república)
 *   Penal → vermelho profundo (crime)
 *   Processo Penal → laranja escuro (alerta)
 *   Administrativo → roxo (poder)
 *   Trabalho → laranja (operário)
 *   Processo Trabalho → âmbar escuro
 *   Tributário → verde-dinheiro
 *   Empresarial → mostarda (comércio)
 *   Direitos Humanos → azul-céu (dignidade)
 *   CDC → fúcsia (consumidor)
 *   ECA → rosa claro (infância)
 *   Ambiental → verde-floresta
 *   Internacional → cinza-azulado (diplomacia)
 *   Filosofia → índigo (pensamento)
 *   Eleitoral → carmim (urna)
 *   Financeiro → ouro (moeda)
 *   Previdenciário → ciano (seguridade)
 */
export type DisciplinaEstatica = {
  slug: string;
  nome: string;
  cor: string; // nome do token Tailwind (ex.: "disc-etica")
  corHex: string; // valor hex direto, usado em style inline quando preciso
  emoji: string; // ícone representativo para cards compactos
  peso: number; // questões previstas por prova
};

export const DISCIPLINAS_ESTATICAS: DisciplinaEstatica[] = [
  { slug: "etica",             nome: "Ética",                   cor: "disc-etica",             corHex: "#1e40af", emoji: "⚖️", peso: 8 },
  { slug: "civil",             nome: "Civil",                   cor: "disc-civil",             corHex: "#f87171", emoji: "🏠", peso: 6 },
  { slug: "processo-civil",    nome: "Processo Civil",          cor: "disc-processo-civil",    corHex: "#60a5fa", emoji: "📑", peso: 6 },
  { slug: "constitucional",    nome: "Constitucional",          cor: "disc-constitucional",    corHex: "#84cc16", emoji: "📜", peso: 6 },
  { slug: "penal",             nome: "Penal",                   cor: "disc-penal",             corHex: "#dc2626", emoji: "🔒", peso: 6 },
  { slug: "processo-penal",    nome: "Processo Penal",          cor: "disc-processo-penal",    corHex: "#ea580c", emoji: "🚓", peso: 6 },
  { slug: "administrativo",    nome: "Administrativo",          cor: "disc-administrativo",    corHex: "#9333ea", emoji: "🏛️", peso: 5 },
  { slug: "trabalho",          nome: "Trabalho",                cor: "disc-trabalho",          corHex: "#f97316", emoji: "👷", peso: 5 },
  { slug: "processo-trabalho", nome: "Processo do Trabalho",    cor: "disc-processo-trabalho", corHex: "#d97706", emoji: "⚙️", peso: 5 },
  { slug: "tributario",        nome: "Tributário",              cor: "disc-tributario",        corHex: "#16a34a", emoji: "💰", peso: 5 },
  { slug: "empresarial",       nome: "Empresarial",             cor: "disc-empresarial",       corHex: "#eab308", emoji: "🏢", peso: 4 },
  { slug: "direitos-humanos",  nome: "Direitos Humanos",        cor: "disc-direitos-humanos",  corHex: "#38bdf8", emoji: "🕊️", peso: 2 },
  { slug: "cdc",               nome: "Defesa do Consumidor",    cor: "disc-cdc",               corHex: "#ec4899", emoji: "🛒", peso: 2 },
  { slug: "eca",               nome: "ECA",                     cor: "disc-eca",               corHex: "#f9a8d4", emoji: "🧒", peso: 2 },
  { slug: "ambiental",         nome: "Ambiental",               cor: "disc-ambiental",         corHex: "#15803d", emoji: "🌳", peso: 2 },
  { slug: "internacional",     nome: "Internacional",           cor: "disc-internacional",     corHex: "#64748b", emoji: "🌐", peso: 2 },
  { slug: "filosofia",         nome: "Filosofia do Direito",    cor: "disc-filosofia",         corHex: "#4338ca", emoji: "💭", peso: 2 },
  { slug: "eleitoral",         nome: "Eleitoral",               cor: "disc-eleitoral",         corHex: "#be123c", emoji: "🗳️", peso: 2 },
  { slug: "financeiro",        nome: "Financeiro",              cor: "disc-financeiro",        corHex: "#ca8a04", emoji: "📊", peso: 2 },
  { slug: "previdenciario",    nome: "Previdenciário",          cor: "disc-previdenciario",    corHex: "#06b6d4", emoji: "🧓", peso: 2 },
];

export function disciplinaPorSlug(slug: string) {
  return DISCIPLINAS_ESTATICAS.find((d) => d.slug === slug);
}
