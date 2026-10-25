/**
 * Lista das 20 disciplinas da 1ª fase do Exame de Ordem, com peso
 * previsto (não oficial — o edital vigente prevalece).
 * Usada em UI estática (perfil, filtros). O banco tem a versão
 * canônica em `public.disciplinas` para quando houver conteúdo.
 */
export type DisciplinaEstatica = {
  slug: string;
  nome: string;
  cor: string;
  peso: number;
};

export const DISCIPLINAS_ESTATICAS: DisciplinaEstatica[] = [
  { slug: "etica", nome: "Ética", cor: "etica", peso: 8 },
  { slug: "civil", nome: "Civil", cor: "civil", peso: 6 },
  { slug: "processo-civil", nome: "Processo Civil", cor: "processo-civil", peso: 6 },
  { slug: "constitucional", nome: "Constitucional", cor: "constitucional", peso: 6 },
  { slug: "penal", nome: "Penal", cor: "penal", peso: 6 },
  { slug: "processo-penal", nome: "Processo Penal", cor: "processo-penal", peso: 6 },
  { slug: "administrativo", nome: "Administrativo", cor: "administrativo", peso: 5 },
  { slug: "trabalho", nome: "Trabalho", cor: "trabalho", peso: 5 },
  { slug: "processo-trabalho", nome: "Processo do Trabalho", cor: "trabalho", peso: 5 },
  { slug: "tributario", nome: "Tributário", cor: "tributario", peso: 5 },
  { slug: "empresarial", nome: "Empresarial", cor: "empresarial", peso: 4 },
  { slug: "direitos-humanos", nome: "Direitos Humanos", cor: "lavender", peso: 2 },
  { slug: "cdc", nome: "Defesa do Consumidor", cor: "mint", peso: 2 },
  { slug: "eca", nome: "ECA", cor: "lavender", peso: 2 },
  { slug: "ambiental", nome: "Ambiental", cor: "mint", peso: 2 },
  { slug: "internacional", nome: "Internacional", cor: "lavender", peso: 2 },
  { slug: "filosofia", nome: "Filosofia do Direito", cor: "lavender", peso: 2 },
  { slug: "eleitoral", nome: "Eleitoral", cor: "eleitoral", peso: 2 },
  { slug: "financeiro", nome: "Financeiro", cor: "lavender", peso: 2 },
  { slug: "previdenciario", nome: "Previdenciário", cor: "lavender", peso: 2 },
];
