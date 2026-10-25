/**
 * Esqueleto de tópicos por disciplina da 1ª fase do Exame de Ordem.
 *
 * A FGV não publica conteúdo programático oficial da 1ª fase objetiva.
 * Esta lista espelha a divisão prática usada pelos principais cursinhos
 * (Mege, Damásio, CERS) e pela doutrina majoritária, baseada no Estatuto
 * da OAB e nos códigos vigentes. Deve ser revisada por advogado antes de
 * publicar como oficial do produto.
 *
 * Formato: slug kebab-case, nome exibido, referência legal principal.
 */

export type TopicoEsqueleto = {
  slug: string;
  nome: string;
  leiReferencia?: string;
};

export const TOPICOS_POR_DISCIPLINA: Record<string, TopicoEsqueleto[]> = {
  etica: [
    { slug: "atividades-privativas", nome: "Atividades privativas do advogado", leiReferencia: "EAOAB art. 1º" },
    { slug: "inscricao-oab", nome: "Inscrição na OAB", leiReferencia: "EAOAB art. 8º-14" },
    { slug: "direitos-prerrogativas", nome: "Direitos e prerrogativas do advogado", leiReferencia: "EAOAB art. 6º-7º" },
    { slug: "deveres-advogado", nome: "Deveres do advogado", leiReferencia: "EAOAB art. 31-33 + CED" },
    { slug: "incompatibilidades-impedimentos", nome: "Incompatibilidades e impedimentos", leiReferencia: "EAOAB art. 27-30" },
    { slug: "honorarios", nome: "Honorários advocatícios", leiReferencia: "EAOAB art. 22-26" },
    { slug: "sociedade-advogados", nome: "Sociedade de advogados", leiReferencia: "EAOAB art. 15-17" },
    { slug: "infracoes-sancoes", nome: "Infrações e sanções disciplinares", leiReferencia: "EAOAB art. 34-43" },
    { slug: "processo-disciplinar", nome: "Processo disciplinar", leiReferencia: "EAOAB art. 68-77" },
    { slug: "publicidade-sigilo", nome: "Publicidade profissional e sigilo", leiReferencia: "CED + Provimento 205/2021" },
  ],

  civil: [
    { slug: "lindb", nome: "Lei de Introdução às Normas do Direito Brasileiro", leiReferencia: "LINDB (Decreto-Lei 4.657/42)" },
    { slug: "parte-geral-pessoas", nome: "Pessoas naturais e jurídicas", leiReferencia: "CC art. 1º-69" },
    { slug: "parte-geral-bens-fatos", nome: "Bens e fatos jurídicos", leiReferencia: "CC art. 79-232" },
    { slug: "prescricao-decadencia", nome: "Prescrição e decadência", leiReferencia: "CC art. 189-211" },
    { slug: "obrigacoes", nome: "Direito das obrigações", leiReferencia: "CC art. 233-420" },
    { slug: "contratos", nome: "Contratos em geral e em espécie", leiReferencia: "CC art. 421-853" },
    { slug: "responsabilidade-civil", nome: "Responsabilidade civil", leiReferencia: "CC art. 927-954" },
    { slug: "direito-coisas", nome: "Direito das coisas", leiReferencia: "CC art. 1.196-1.510" },
    { slug: "familia", nome: "Direito de família", leiReferencia: "CC art. 1.511-1.783" },
    { slug: "sucessoes", nome: "Direito das sucessões", leiReferencia: "CC art. 1.784-2.027" },
  ],

  "processo-civil": [
    { slug: "principios-cpc", nome: "Normas fundamentais e princípios", leiReferencia: "CPC art. 1º-15" },
    { slug: "jurisdicao-competencia", nome: "Jurisdição e competência", leiReferencia: "CPC art. 42-69" },
    { slug: "partes-procuradores", nome: "Partes, procuradores e atos processuais", leiReferencia: "CPC art. 70-275" },
    { slug: "tutela-provisoria", nome: "Tutela provisória (urgência e evidência)", leiReferencia: "CPC art. 294-311" },
    { slug: "procedimento-comum", nome: "Procedimento comum (inicial, resposta, saneamento)", leiReferencia: "CPC art. 318-357" },
    { slug: "provas", nome: "Produção de provas", leiReferencia: "CPC art. 369-484" },
    { slug: "sentenca-coisa-julgada", nome: "Sentença, coisa julgada, remessa necessária", leiReferencia: "CPC art. 485-508" },
    { slug: "recursos", nome: "Recursos (apelação, agravo, embargos, especial, extraordinário)", leiReferencia: "CPC art. 994-1.044" },
    { slug: "cumprimento-execucao", nome: "Cumprimento de sentença e execução", leiReferencia: "CPC art. 513-925" },
    { slug: "juizados-civeis", nome: "Juizados Especiais Cíveis", leiReferencia: "Lei 9.099/95 + Lei 10.259/01" },
  ],

  constitucional: [
    { slug: "principios-fundamentais", nome: "Princípios fundamentais e Preâmbulo", leiReferencia: "CF art. 1º-4º" },
    { slug: "direitos-garantias", nome: "Direitos e garantias fundamentais", leiReferencia: "CF art. 5º-17" },
    { slug: "organizacao-estado", nome: "Organização do Estado (federação, União, estados, municípios)", leiReferencia: "CF art. 18-43" },
    { slug: "organizacao-poderes", nome: "Organização dos Poderes (Legislativo, Executivo, Judiciário, MP)", leiReferencia: "CF art. 44-135" },
    { slug: "defesa-estado", nome: "Defesa do Estado e das instituições democráticas", leiReferencia: "CF art. 136-144" },
    { slug: "sistema-tributario-financeiro", nome: "Sistema tributário e financeiro constitucional", leiReferencia: "CF art. 145-169" },
    { slug: "ordem-economica-social", nome: "Ordem econômica, social e ambiental", leiReferencia: "CF art. 170-232" },
    { slug: "controle-constitucionalidade", nome: "Controle de constitucionalidade (difuso, concentrado, ADI, ADC, ADPF)", leiReferencia: "CF art. 102-103; Lei 9.868/99; Lei 9.882/99" },
    { slug: "remedios-constitucionais", nome: "Remédios constitucionais (HC, HD, MS, MI, ação popular)", leiReferencia: "CF art. 5º LXVIII-LXXVII" },
  ],

  penal: [
    { slug: "principios-aplicacao-lei-penal", nome: "Princípios e aplicação da lei penal", leiReferencia: "CP art. 1º-12" },
    { slug: "teoria-crime", nome: "Teoria do crime (fato típico, antijuridicidade, culpabilidade)", leiReferencia: "CP art. 13-25" },
    { slug: "culpabilidade", nome: "Culpabilidade e suas excludentes", leiReferencia: "CP art. 26-28" },
    { slug: "concurso-pessoas-crimes", nome: "Concurso de pessoas e de crimes", leiReferencia: "CP art. 29-31 + 69-71" },
    { slug: "penas-medidas-seguranca", nome: "Penas e medidas de segurança", leiReferencia: "CP art. 32-96" },
    { slug: "extincao-punibilidade", nome: "Extinção da punibilidade (prescrição, decadência, perdão)", leiReferencia: "CP art. 107-120" },
    { slug: "crimes-pessoa", nome: "Crimes contra a pessoa", leiReferencia: "CP art. 121-154" },
    { slug: "crimes-patrimonio", nome: "Crimes contra o patrimônio", leiReferencia: "CP art. 155-183" },
    { slug: "crimes-administracao", nome: "Crimes contra a administração pública", leiReferencia: "CP art. 312-359" },
    { slug: "legislacao-especial", nome: "Legislação especial (Maria da Penha, drogas, ECA, lavagem, organizações)", leiReferencia: "Leis 11.340/06, 11.343/06, 8.069/90, 9.613/98, 12.850/13" },
  ],

  "processo-penal": [
    { slug: "principios-pp", nome: "Princípios e sistemas processuais penais", leiReferencia: "CPP art. 1º-3º + CF" },
    { slug: "inquerito-policial", nome: "Inquérito policial", leiReferencia: "CPP art. 4º-23" },
    { slug: "acao-penal", nome: "Ação penal pública e privada", leiReferencia: "CPP art. 24-62" },
    { slug: "jurisdicao-competencia-pp", nome: "Jurisdição e competência penal", leiReferencia: "CPP art. 69-91" },
    { slug: "provas-pp", nome: "Prova no processo penal", leiReferencia: "CPP art. 155-250" },
    { slug: "prisao-cautelares", nome: "Prisão e medidas cautelares", leiReferencia: "CPP art. 282-350; Pacote Anticrime" },
    { slug: "procedimento-comum", nome: "Procedimento comum (ordinário, sumário, sumaríssimo)", leiReferencia: "CPP art. 394-497" },
    { slug: "juri", nome: "Tribunal do Júri", leiReferencia: "CPP art. 406-497" },
    { slug: "nulidades", nome: "Nulidades e recursos no processo penal", leiReferencia: "CPP art. 563-667" },
    { slug: "habeas-corpus-revisao", nome: "Habeas corpus e revisão criminal", leiReferencia: "CPP art. 621-667 + CF" },
    { slug: "juizados-criminais", nome: "Juizados Especiais Criminais", leiReferencia: "Lei 9.099/95 art. 60-92" },
  ],

  administrativo: [
    { slug: "regime-principios", nome: "Regime jurídico administrativo e princípios", leiReferencia: "CF art. 37-41; Lei 9.784/99" },
    { slug: "organizacao-administrativa", nome: "Organização administrativa (direta/indireta, autarquias)", leiReferencia: "DL 200/67; Lei 11.107/05" },
    { slug: "atos-administrativos", nome: "Atos administrativos (classificação, atributos, vícios)", leiReferencia: "Doutrina + Lei 9.784/99" },
    { slug: "agentes-publicos", nome: "Agentes públicos (concurso, estatuto)", leiReferencia: "CF art. 37-41; Lei 8.112/90" },
    { slug: "licitacoes-contratos", nome: "Licitações e contratos (Lei 14.133/21)", leiReferencia: "Lei 14.133/21 (NLLC)" },
    { slug: "servicos-publicos", nome: "Serviços públicos (concessão, permissão)", leiReferencia: "Lei 8.987/95; Lei 11.079/04" },
    { slug: "bens-publicos", nome: "Bens públicos", leiReferencia: "CC art. 98-103" },
    { slug: "improbidade", nome: "Improbidade administrativa", leiReferencia: "Lei 8.429/92 (alterada pela Lei 14.230/21)" },
    { slug: "processo-administrativo", nome: "Processo administrativo federal", leiReferencia: "Lei 9.784/99" },
    { slug: "intervencao-propriedade", nome: "Intervenção do Estado na propriedade (desapropriação, servidão)", leiReferencia: "DL 3.365/41; CF art. 5º XXIV" },
  ],

  trabalho: [
    { slug: "fontes-principios", nome: "Fontes e princípios do direito do trabalho", leiReferencia: "CLT art. 8º + CF art. 7º" },
    { slug: "relacao-emprego", nome: "Relação de emprego (requisitos, sujeitos)", leiReferencia: "CLT art. 2º-3º" },
    { slug: "contrato-trabalho", nome: "Contrato de trabalho (modalidades, alteração)", leiReferencia: "CLT art. 442-510 + Reforma 2017" },
    { slug: "jornada-salario", nome: "Jornada de trabalho e salário", leiReferencia: "CLT art. 57-72, 457-467" },
    { slug: "suspensao-interrupcao", nome: "Suspensão e interrupção do contrato", leiReferencia: "CLT art. 471-476" },
    { slug: "rescisao", nome: "Rescisão contratual (hipóteses e verbas)", leiReferencia: "CLT art. 477-486" },
    { slug: "ferias-13", nome: "Férias e 13º salário", leiReferencia: "CLT art. 129-153; Lei 4.090/62" },
    { slug: "fgts", nome: "FGTS e benefícios", leiReferencia: "Lei 8.036/90" },
    { slug: "normas-protecao", nome: "Normas de proteção (gestante, menor, insalubridade, periculosidade)", leiReferencia: "CLT art. 189-200, 391-401, 402-441" },
    { slug: "direito-coletivo", nome: "Direito coletivo do trabalho (sindicato, greve, CCT, ACT)", leiReferencia: "CLT art. 511-625 + Lei 7.783/89" },
  ],

  "processo-trabalho": [
    { slug: "principios-jt", nome: "Princípios e organização da Justiça do Trabalho", leiReferencia: "CF art. 111-116; CLT art. 643-668" },
    { slug: "jus-postulandi-partes", nome: "Partes, jus postulandi, Ministério Público do Trabalho", leiReferencia: "CLT art. 791 + LC 75/93" },
    { slug: "procedimento-comum-sumaris", nome: "Procedimento comum e sumaríssimo", leiReferencia: "CLT art. 837-855; Lei 9.957/00" },
    { slug: "audiencia-provas-trab", nome: "Audiência e produção de provas", leiReferencia: "CLT art. 843-852 + CPC" },
    { slug: "recursos-trab", nome: "Recursos trabalhistas (RO, RR, agravo)", leiReferencia: "CLT art. 893-897" },
    { slug: "execucao-trab", nome: "Execução trabalhista", leiReferencia: "CLT art. 876-892" },
    { slug: "dissidio-coletivo", nome: "Dissídio coletivo", leiReferencia: "CLT art. 856-875" },
  ],

  tributario: [
    { slug: "sistema-tributario-cf", nome: "Sistema tributário nacional na CF", leiReferencia: "CF art. 145-162" },
    { slug: "competencia-tributaria", nome: "Competência tributária e repartição de receitas", leiReferencia: "CF art. 145-156" },
    { slug: "limitacoes-tributar", nome: "Limitações constitucionais ao poder de tributar (princípios e imunidades)", leiReferencia: "CF art. 150-152" },
    { slug: "normas-gerais-ctn", nome: "Normas gerais do CTN - legislação tributária", leiReferencia: "CTN art. 96-112" },
    { slug: "obrigacao-tributaria", nome: "Obrigação tributária (fato gerador, sujeitos, responsabilidade)", leiReferencia: "CTN art. 113-138" },
    { slug: "credito-tributario", nome: "Crédito tributário (lançamento, suspensão, extinção, exclusão)", leiReferencia: "CTN art. 139-193" },
    { slug: "impostos-federais", nome: "Impostos federais (IR, IPI, ITR, IOF, II, IE)", leiReferencia: "CF art. 153 + leis específicas" },
    { slug: "impostos-estaduais", nome: "Impostos estaduais (ICMS, IPVA, ITCMD)", leiReferencia: "CF art. 155 + LC 87/96" },
    { slug: "impostos-municipais", nome: "Impostos municipais (ISS, IPTU, ITBI)", leiReferencia: "CF art. 156 + LC 116/03" },
    { slug: "processo-tributario", nome: "Processo administrativo e judicial tributário", leiReferencia: "LEF (Lei 6.830/80) + CTN art. 194-208" },
  ],

  empresarial: [
    { slug: "empresario-sociedades-cc", nome: "Empresário individual e sociedades no CC", leiReferencia: "CC art. 966-1.195" },
    { slug: "sociedades-especie", nome: "Sociedades em espécie (LTDA, S.A., EIRELI/SLU)", leiReferencia: "CC + Lei 6.404/76" },
    { slug: "titulos-credito-teoria", nome: "Teoria geral dos títulos de crédito", leiReferencia: "CC art. 887-926" },
    { slug: "titulos-credito-especie", nome: "Títulos em espécie (cheque, duplicata, nota promissória, letra de câmbio)", leiReferencia: "Leis 7.357/85, 5.474/68, LUG" },
    { slug: "falencia-recuperacao", nome: "Falência e recuperação judicial/extrajudicial", leiReferencia: "Lei 11.101/05 (alterada pela 14.112/20)" },
    { slug: "propriedade-industrial", nome: "Propriedade industrial (marcas, patentes)", leiReferencia: "Lei 9.279/96" },
  ],

  "direitos-humanos": [
    { slug: "teoria-dh", nome: "Teoria geral e DUDH", leiReferencia: "DUDH 1948" },
    { slug: "sistema-interamericano", nome: "Sistema interamericano - Pacto San José", leiReferencia: "Decreto 678/92" },
    { slug: "tratados-brasil", nome: "Tratados de DH no Brasil (status, incorporação)", leiReferencia: "CF art. 5º § 3º" },
  ],

  cdc: [
    { slug: "consumidor-fornecedor", nome: "Consumidor, fornecedor, produto e serviço", leiReferencia: "CDC art. 2º-3º" },
    { slug: "direitos-basicos", nome: "Direitos básicos do consumidor", leiReferencia: "CDC art. 6º" },
    { slug: "responsabilidade-cdc", nome: "Responsabilidade por fato e por vício", leiReferencia: "CDC art. 12-27" },
    { slug: "praticas-contratuais", nome: "Práticas comerciais, cláusulas abusivas, proteção contratual", leiReferencia: "CDC art. 29-54" },
  ],

  eca: [
    { slug: "direitos-fundamentais-eca", nome: "Direitos fundamentais da criança e do adolescente", leiReferencia: "ECA art. 7º-69" },
    { slug: "medidas-protecao", nome: "Medidas de proteção e socioeducativas", leiReferencia: "ECA art. 98-128" },
    { slug: "conselho-tutelar", nome: "Conselho Tutelar e política de atendimento", leiReferencia: "ECA art. 86-130" },
    { slug: "ato-infracional", nome: "Ato infracional e procedimentos", leiReferencia: "ECA art. 103-128" },
  ],

  ambiental: [
    { slug: "pnma", nome: "Política Nacional do Meio Ambiente", leiReferencia: "Lei 6.938/81" },
    { slug: "snuc", nome: "Unidades de conservação (SNUC)", leiReferencia: "Lei 9.985/00" },
    { slug: "crimes-ambientais", nome: "Crimes ambientais", leiReferencia: "Lei 9.605/98" },
    { slug: "codigo-florestal", nome: "Código Florestal e áreas protegidas (APP, RL)", leiReferencia: "Lei 12.651/12" },
    { slug: "responsabilidade-ambiental", nome: "Responsabilidade civil, administrativa e penal ambiental", leiReferencia: "CF art. 225 § 3º" },
  ],

  internacional: [
    { slug: "dip-publico", nome: "Direito Internacional Público (fontes, tratados)", leiReferencia: "Convenção de Viena 1969" },
    { slug: "dip-privado", nome: "Direito Internacional Privado (elementos de conexão, LINDB)", leiReferencia: "LINDB art. 7º-19" },
    { slug: "nacionalidade-estrangeiro", nome: "Nacionalidade e condição jurídica do estrangeiro", leiReferencia: "CF art. 12-13 + Lei 13.445/17" },
  ],

  filosofia: [
    { slug: "jusnaturalismo-positivismo", nome: "Jusnaturalismo, positivismo e pós-positivismo", leiReferencia: "Doutrina" },
    { slug: "teoria-justica", nome: "Teoria da justiça (Rawls, utilitarismo)", leiReferencia: "Doutrina" },
    { slug: "hermeneutica", nome: "Hermenêutica jurídica e interpretação", leiReferencia: "Doutrina" },
  ],

  eleitoral: [
    { slug: "direitos-politicos", nome: "Direitos políticos e partidos", leiReferencia: "CF art. 14-17 + Lei 9.096/95" },
    { slug: "elegibilidade-inelegibilidade", nome: "Elegibilidade e inelegibilidades", leiReferencia: "CF art. 14 + LC 64/90" },
    { slug: "propaganda-eleitoral", nome: "Propaganda eleitoral", leiReferencia: "Lei 9.504/97 art. 36-57" },
    { slug: "crimes-eleitorais", nome: "Crimes eleitorais e condutas vedadas", leiReferencia: "Código Eleitoral art. 283-354" },
  ],

  financeiro: [
    { slug: "orcamento", nome: "Orçamento público (PPA, LDO, LOA)", leiReferencia: "CF art. 165-169 + Lei 4.320/64" },
    { slug: "receita-despesa", nome: "Receita e despesa pública", leiReferencia: "Lei 4.320/64" },
    { slug: "lrf", nome: "Lei de Responsabilidade Fiscal", leiReferencia: "LC 101/00" },
  ],

  previdenciario: [
    { slug: "seguridade-social", nome: "Seguridade social - princípios e organização", leiReferencia: "CF art. 194-204" },
    { slug: "custeio", nome: "Custeio previdenciário (contribuições, segurados)", leiReferencia: "Lei 8.212/91" },
    { slug: "beneficios-rgps", nome: "Benefícios do RGPS (aposentadoria, pensão, auxílio)", leiReferencia: "Lei 8.213/91 + EC 103/19" },
  ],
};
