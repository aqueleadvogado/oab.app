/**
 * Schema completo do OAB em Blocos.
 * Agrupado em um arquivo para a Fase 1; pode ser quebrado em módulos se crescer.
 *
 * Convenções:
 * - IDs: uuid gerado no banco (gen_random_uuid()), exceto onde faz sentido serial.
 * - Timestamps: sempre `timestamp with time zone`.
 * - "Usuário" = auth.users do Supabase (não controlado pelo Drizzle); referenciamos só por UUID.
 * - Nomes de coluna em snake_case (configurado via drizzle.config.ts casing).
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  numeric,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ─────────────────────────── Enums ─────────────────────────── */

export const statusConteudoEnum = pgEnum("status_conteudo", [
  "rascunho",
  "em_revisao",
  "aprovado",
  "publicado",
]);

export const papelEnum = pgEnum("papel", [
  "admin",
  "revisor_juridico",
  "suporte",
]);

export const tipoPassoEnum = pgEnum("tipo_passo", [
  "mapa",
  "macete",
  "pegadinha",
  "exemplo",
  "questao",
  "texto",
]);

export const energiaEnum = pgEnum("energia", ["verde", "amarelo", "vermelho"]);

export const statusAssinaturaEnum = pgEnum("status_assinatura", [
  "ativo",
  "aguardando_pagamento",
  "em_atraso",
  "cancelado",
  "reembolsado",
  "expirado",
]);

export const metodoPagamentoEnum = pgEnum("metodo_pagamento", [
  "cartao",
  "pix",
  "boleto",
]);

export const statusPagamentoEnum = pgEnum("status_pagamento", [
  "pendente",
  "aprovado",
  "recusado",
  "estornado",
]);

/* ─────────────────────── Perfil + papéis ─────────────────────── */

/**
 * profiles — espelho 1:1 de auth.users do Supabase, para dados do produto.
 * O id === auth.users.id (uuid).
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // = auth.users.id (preenchido por trigger ou pelo app)
  nome: text("nome"),
  email: text("email"), // cópia para busca rápida (fonte de verdade: auth.users)
  dataProva: date("data_prova"),
  materiasPrioritarias: jsonb("materias_prioritarias")
    .$type<string[]>()
    .default([]),
  prefsAcessibilidade: jsonb("prefs_acessibilidade")
    .$type<{
      tamanhoFonte?: "menor" | "normal" | "maior";
      espacamento?: "normal" | "amplo";
      fonteLegivel?: boolean;
      altoContraste?: boolean;
      tema?: "claro" | "escuro" | "sistema";
      reduzirAnimacoes?: boolean;
      modoFoco?: boolean;
    }>()
    .default({}),
  horarioLembrete: text("horario_lembrete"), // "19:30"
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const papeis = pgTable(
  "papeis",
  {
    userId: uuid("user_id").notNull(),
    papel: papelEnum("papel").notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("papeis_user_papel_uq").on(t.userId, t.papel),
    index("papeis_user_idx").on(t.userId),
  ],
);

/* ─────────────────────── Conteúdo ─────────────────────── */

export const disciplinas = pgTable("disciplinas", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(), // "etica", "constitucional"...
  nome: text("nome").notNull(),
  cor: text("cor"), // token da paleta: "etica", "civil"... (opcional, serve o slug)
  pesoProva: integer("peso_prova").notNull().default(0), // ex: 8 para Ética
  ordem: integer("ordem").notNull().default(0),
  ativa: boolean("ativa").notNull().default(true),
});

export const topicos = pgTable(
  "topicos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    disciplinaId: uuid("disciplina_id")
      .notNull()
      .references(() => disciplinas.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    nome: text("nome").notNull(),
    ordem: integer("ordem").notNull().default(0),
    leiReferencia: text("lei_referencia"), // ex: "Lei 8.906/94 art. 1-5"
    versaoNorma: text("versao_norma"), // ex: "redação da Lei 14.365/2022"
  },
  (t) => [uniqueIndex("topicos_disc_slug_uq").on(t.disciplinaId, t.slug)],
);

export const blocos = pgTable(
  "blocos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    topicoId: uuid("topico_id")
      .notNull()
      .references(() => topicos.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    duracaoMin: integer("duracao_min").notNull().default(15),
    resumo: text("resumo"),
    ordem: integer("ordem").notNull().default(0),

    // Fluxo de revisão jurídica
    status: statusConteudoEnum("status").notNull().default("rascunho"),
    criadoPor: uuid("criado_por"),
    revisadoPor: uuid("revisado_por"),
    dataRevisao: timestamp("data_revisao", { withTimezone: true }),
    revisarEm: date("revisar_em"), // alerta de revisão futura

    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("blocos_topico_idx").on(t.topicoId, t.ordem)],
);

export const passos = pgTable(
  "passos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    blocoId: uuid("bloco_id")
      .notNull()
      .references(() => blocos.id, { onDelete: "cascade" }),
    ordem: integer("ordem").notNull().default(0),
    tipo: tipoPassoEnum("tipo").notNull(),
    conteudoMd: text("conteudo_md").notNull(),
  },
  (t) => [index("passos_bloco_idx").on(t.blocoId, t.ordem)],
);

export const questoes = pgTable("questoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  blocoId: uuid("bloco_id").references(() => blocos.id, {
    onDelete: "set null",
  }),
  // Classificação temática independente do bloco (ex: questão FGV que vive no bloco
  // "47º Exame" mas é classificada como "Ética → Atividades Privativas").
  // Usada pelo caderno de erros e pelo painel de desempenho por disciplina.
  topicoClassificadoId: uuid("topico_classificado_id").references(
    () => topicos.id,
    { onDelete: "set null" },
  ),
  enunciado: text("enunciado").notNull(),
  alternativas: jsonb("alternativas")
    .$type<{ chave: string; texto: string }[]>()
    .notNull(), // [{chave: "A", texto: "..."}, ...]
  correta: text("correta").notNull(), // "A" | "B" | "C" | "D"
  comentario: text("comentario"),
  tags: jsonb("tags").$type<string[]>().default([]),
  nivel: integer("nivel").notNull().default(2), // 1-5
  leiReferencia: text("lei_referencia"),
  status: statusConteudoEnum("status").notNull().default("rascunho"),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cartoes = pgTable("cartoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  blocoId: uuid("bloco_id").references(() => blocos.id, {
    onDelete: "set null",
  }),
  frente: text("frente").notNull(),
  verso: text("verso").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: statusConteudoEnum("status").notNull().default("rascunho"),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ─────────────────────── Progresso do aluno ─────────────────────── */

export const respostas = pgTable(
  "respostas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    questaoId: uuid("questao_id")
      .notNull()
      .references(() => questoes.id, { onDelete: "cascade" }),
    escolhida: text("escolhida").notNull(),
    acertou: boolean("acertou").notNull(),
    tempoSegundos: integer("tempo_segundos"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("respostas_user_idx").on(t.userId, t.criadoEm),
    index("respostas_questao_idx").on(t.questaoId),
  ],
);

/**
 * revisoes — fila de revisão espaçada do aluno.
 * Serve para cartões e para questões erradas. Algoritmo SM-2 simplificado:
 *   fator (default 2.5), intervaloDias cresce a cada acerto, reseta em lapso.
 */
export const revisoes = pgTable(
  "revisoes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    cartaoId: uuid("cartao_id").references(() => cartoes.id, {
      onDelete: "cascade",
    }),
    questaoId: uuid("questao_id").references(() => questoes.id, {
      onDelete: "cascade",
    }),
    fator: numeric("fator", { precision: 4, scale: 2 }).notNull().default("2.50"),
    intervaloDias: integer("intervalo_dias").notNull().default(1),
    lapsos: integer("lapsos").notNull().default(0),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    ultimaRevisao: timestamp("ultima_revisao", { withTimezone: true }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("revisoes_user_due_idx").on(t.userId, t.dueAt),
    index("revisoes_cartao_idx").on(t.cartaoId),
    index("revisoes_questao_idx").on(t.questaoId),
  ],
);

export const sessoes = pgTable(
  "sessoes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    data: date("data").notNull(),
    energia: energiaEnum("energia"),
    blocosFeitos: integer("blocos_feitos").notNull().default(0),
    minutos: integer("minutos").notNull().default(0),
    streakDia: integer("streak_dia").notNull().default(0),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("sessoes_user_data_uq").on(t.userId, t.data)],
);

export const planoDoDia = pgTable(
  "plano_do_dia",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    data: date("data").notNull(),
    itens: jsonb("itens")
      .$type<
        {
          tipo: "bloco" | "pausa" | "revisao";
          blocoId?: string;
          minutos: number;
          titulo?: string;
          disciplinaSlug?: string;
        }[]
      >()
      .notNull()
      .default([]),
    gerado: timestamp("gerado", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("plano_user_data_uq").on(t.userId, t.data)],
);

export const cronometroEstado = pgTable("cronometro_estado", {
  userId: uuid("user_id").primaryKey(),
  blocoId: uuid("bloco_id"),
  inicioTs: timestamp("inicio_ts", { withTimezone: true }).notNull(),
  duracaoSegundos: integer("duracao_segundos").notNull(),
  pausadoEm: timestamp("pausado_em", { withTimezone: true }),
  acumuladoPausaSegundos: integer("acumulado_pausa_segundos")
    .notNull()
    .default(0),
});

/* ─────────────────────── Comercial ─────────────────────── */

export const planos = pgTable("planos", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  precoCentavos: integer("preco_centavos").notNull(),
  periodicidadeDias: integer("periodicidade_dias").notNull(), // 365 para anual
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const assinaturas = pgTable(
  "assinaturas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    planoId: uuid("plano_id")
      .notNull()
      .references(() => planos.id),
    provedor: text("provedor").notNull(), // "mercado_pago" | "asaas"
    provedorId: text("provedor_id"), // id da assinatura no provedor
    status: statusAssinaturaEnum("status").notNull(),
    inicio: timestamp("inicio", { withTimezone: true }),
    fim: timestamp("fim", { withTimezone: true }),
    canceladoEm: timestamp("cancelado_em", { withTimezone: true }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("assinaturas_user_idx").on(t.userId),
    index("assinaturas_status_idx").on(t.status),
  ],
);

export const pagamentos = pgTable(
  "pagamentos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assinaturaId: uuid("assinatura_id").references(() => assinaturas.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id").notNull(),
    valorCentavos: integer("valor_centavos").notNull(),
    metodo: metodoPagamentoEnum("metodo").notNull(),
    status: statusPagamentoEnum("status").notNull(),
    provedor: text("provedor").notNull(),
    provedorPaymentId: text("provedor_payment_id"),
    webhookPayload: jsonb("webhook_payload"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("pagamentos_user_idx").on(t.userId),
    uniqueIndex("pagamentos_provedor_uq").on(t.provedor, t.provedorPaymentId),
  ],
);

export const cupons = pgTable("cupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  codigo: text("codigo").notNull().unique(),
  descontoPct: integer("desconto_pct"),
  descontoCentavos: integer("desconto_centavos"),
  validade: date("validade"),
  maxUsos: integer("max_usos"),
  usosAtuais: integer("usos_atuais").notNull().default(0),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: timestamp("criado_em", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ─────────────────────── Governança ─────────────────────── */

export const auditoria = pgTable(
  "auditoria",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id"), // null para ações do sistema (webhooks, jobs)
    acao: text("acao").notNull(), // "bloco.publicou", "assinatura.cancelou"...
    alvoTipo: text("alvo_tipo"),
    alvoId: text("alvo_id"),
    antes: jsonb("antes"),
    depois: jsonb("depois"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("auditoria_actor_idx").on(t.actorId, t.criadoEm),
    index("auditoria_alvo_idx").on(t.alvoTipo, t.alvoId),
  ],
);
