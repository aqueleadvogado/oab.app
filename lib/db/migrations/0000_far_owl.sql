CREATE TYPE "public"."energia" AS ENUM('verde', 'amarelo', 'vermelho');--> statement-breakpoint
CREATE TYPE "public"."metodo_pagamento" AS ENUM('cartao', 'pix', 'boleto');--> statement-breakpoint
CREATE TYPE "public"."papel" AS ENUM('admin', 'revisor_juridico', 'suporte');--> statement-breakpoint
CREATE TYPE "public"."status_assinatura" AS ENUM('ativo', 'aguardando_pagamento', 'em_atraso', 'cancelado', 'reembolsado', 'expirado');--> statement-breakpoint
CREATE TYPE "public"."status_conteudo" AS ENUM('rascunho', 'em_revisao', 'aprovado', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."status_pagamento" AS ENUM('pendente', 'aprovado', 'recusado', 'estornado');--> statement-breakpoint
CREATE TYPE "public"."tipo_passo" AS ENUM('mapa', 'macete', 'pegadinha', 'exemplo', 'questao', 'texto');--> statement-breakpoint
CREATE TABLE "assinaturas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plano_id" uuid NOT NULL,
	"provedor" text NOT NULL,
	"provedor_id" text,
	"status" "status_assinatura" NOT NULL,
	"inicio" timestamp with time zone,
	"fim" timestamp with time zone,
	"cancelado_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"acao" text NOT NULL,
	"alvo_tipo" text,
	"alvo_id" text,
	"antes" jsonb,
	"depois" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topico_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"duracao_min" integer DEFAULT 15 NOT NULL,
	"resumo" text,
	"ordem" integer DEFAULT 0 NOT NULL,
	"status" "status_conteudo" DEFAULT 'rascunho' NOT NULL,
	"criado_por" uuid,
	"revisado_por" uuid,
	"data_revisao" timestamp with time zone,
	"revisar_em" date,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cartoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bloco_id" uuid,
	"frente" text NOT NULL,
	"verso" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"status" "status_conteudo" DEFAULT 'rascunho' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cronometro_estado" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"bloco_id" uuid,
	"inicio_ts" timestamp with time zone NOT NULL,
	"duracao_segundos" integer NOT NULL,
	"pausado_em" timestamp with time zone,
	"acumulado_pausa_segundos" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" text NOT NULL,
	"desconto_pct" integer,
	"desconto_centavos" integer,
	"validade" date,
	"max_usos" integer,
	"usos_atuais" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cupons_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "disciplinas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"cor" text,
	"peso_prova" integer DEFAULT 0 NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL,
	CONSTRAINT "disciplinas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pagamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assinatura_id" uuid,
	"user_id" uuid NOT NULL,
	"valor_centavos" integer NOT NULL,
	"metodo" "metodo_pagamento" NOT NULL,
	"status" "status_pagamento" NOT NULL,
	"provedor" text NOT NULL,
	"provedor_payment_id" text,
	"webhook_payload" jsonb,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "papeis" (
	"user_id" uuid NOT NULL,
	"papel" "papel" NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bloco_id" uuid NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"tipo" "tipo_passo" NOT NULL,
	"conteudo_md" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plano_do_dia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"data" date NOT NULL,
	"itens" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gerado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"preco_centavos" integer NOT NULL,
	"periodicidade_dias" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "planos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" text,
	"email" text,
	"data_prova" date,
	"materias_prioritarias" jsonb DEFAULT '[]'::jsonb,
	"prefs_acessibilidade" jsonb DEFAULT '{}'::jsonb,
	"horario_lembrete" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bloco_id" uuid,
	"enunciado" text NOT NULL,
	"alternativas" jsonb NOT NULL,
	"correta" text NOT NULL,
	"comentario" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"nivel" integer DEFAULT 2 NOT NULL,
	"lei_referencia" text,
	"status" "status_conteudo" DEFAULT 'rascunho' NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "respostas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"questao_id" uuid NOT NULL,
	"escolhida" text NOT NULL,
	"acertou" boolean NOT NULL,
	"tempo_segundos" integer,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"cartao_id" uuid,
	"questao_id" uuid,
	"fator" numeric(4, 2) DEFAULT '2.50' NOT NULL,
	"intervalo_dias" integer DEFAULT 1 NOT NULL,
	"lapsos" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"ultima_revisao" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"data" date NOT NULL,
	"energia" "energia",
	"blocos_feitos" integer DEFAULT 0 NOT NULL,
	"minutos" integer DEFAULT 0 NOT NULL,
	"streak_dia" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"disciplina_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"nome" text NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"lei_referencia" text,
	"versao_norma" text
);
--> statement-breakpoint
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_plano_id_planos_id_fk" FOREIGN KEY ("plano_id") REFERENCES "public"."planos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocos" ADD CONSTRAINT "blocos_topico_id_topicos_id_fk" FOREIGN KEY ("topico_id") REFERENCES "public"."topicos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cartoes" ADD CONSTRAINT "cartoes_bloco_id_blocos_id_fk" FOREIGN KEY ("bloco_id") REFERENCES "public"."blocos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_assinatura_id_assinaturas_id_fk" FOREIGN KEY ("assinatura_id") REFERENCES "public"."assinaturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passos" ADD CONSTRAINT "passos_bloco_id_blocos_id_fk" FOREIGN KEY ("bloco_id") REFERENCES "public"."blocos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questoes" ADD CONSTRAINT "questoes_bloco_id_blocos_id_fk" FOREIGN KEY ("bloco_id") REFERENCES "public"."blocos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_questao_id_questoes_id_fk" FOREIGN KEY ("questao_id") REFERENCES "public"."questoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisoes" ADD CONSTRAINT "revisoes_cartao_id_cartoes_id_fk" FOREIGN KEY ("cartao_id") REFERENCES "public"."cartoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisoes" ADD CONSTRAINT "revisoes_questao_id_questoes_id_fk" FOREIGN KEY ("questao_id") REFERENCES "public"."questoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topicos" ADD CONSTRAINT "topicos_disciplina_id_disciplinas_id_fk" FOREIGN KEY ("disciplina_id") REFERENCES "public"."disciplinas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assinaturas_user_idx" ON "assinaturas" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assinaturas_status_idx" ON "assinaturas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "auditoria_actor_idx" ON "auditoria" USING btree ("actor_id","criado_em");--> statement-breakpoint
CREATE INDEX "auditoria_alvo_idx" ON "auditoria" USING btree ("alvo_tipo","alvo_id");--> statement-breakpoint
CREATE INDEX "blocos_topico_idx" ON "blocos" USING btree ("topico_id","ordem");--> statement-breakpoint
CREATE INDEX "pagamentos_user_idx" ON "pagamentos" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pagamentos_provedor_uq" ON "pagamentos" USING btree ("provedor","provedor_payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "papeis_user_papel_uq" ON "papeis" USING btree ("user_id","papel");--> statement-breakpoint
CREATE INDEX "papeis_user_idx" ON "papeis" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passos_bloco_idx" ON "passos" USING btree ("bloco_id","ordem");--> statement-breakpoint
CREATE UNIQUE INDEX "plano_user_data_uq" ON "plano_do_dia" USING btree ("user_id","data");--> statement-breakpoint
CREATE INDEX "respostas_user_idx" ON "respostas" USING btree ("user_id","criado_em");--> statement-breakpoint
CREATE INDEX "respostas_questao_idx" ON "respostas" USING btree ("questao_id");--> statement-breakpoint
CREATE INDEX "revisoes_user_due_idx" ON "revisoes" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE INDEX "revisoes_cartao_idx" ON "revisoes" USING btree ("cartao_id");--> statement-breakpoint
CREATE INDEX "revisoes_questao_idx" ON "revisoes" USING btree ("questao_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessoes_user_data_uq" ON "sessoes" USING btree ("user_id","data");--> statement-breakpoint
CREATE UNIQUE INDEX "topicos_disc_slug_uq" ON "topicos" USING btree ("disciplina_id","slug");