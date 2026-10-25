-- Fase 1.5 — Autenticação e RLS mínimo
-- Trigger: cria profile automaticamente ao criar auth.users
-- RLS: cada aluno vê só os próprios dados; conteúdo publicado é visível a logados

-- ─────────────────── Trigger ───────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, criado_em, atualizado_em)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualiza email no profiles quando atualiza em auth.users
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles
       SET email = NEW.email, atualizado_em = NOW()
     WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

-- ─────────────────── Enable RLS ───────────────────

ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papeis             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topicos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisoes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plano_do_dia       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cronometro_estado  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria          ENABLE ROW LEVEL SECURITY;

-- ─────────────────── Políticas: dados pessoais do aluno ───────────────────

-- profiles: cada user vê e edita apenas o próprio
CREATE POLICY "profiles_select_self" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- respostas / revisoes / sessoes / plano_do_dia / cronometro_estado: dono apenas
CREATE POLICY "respostas_own" ON public.respostas
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "revisoes_own" ON public.revisoes
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "sessoes_own" ON public.sessoes
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "plano_do_dia_own" ON public.plano_do_dia
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "cronometro_own" ON public.cronometro_estado
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- assinaturas / pagamentos: aluno vê os próprios; escrita só via service_role (webhook)
CREATE POLICY "assinaturas_select_own" ON public.assinaturas
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "pagamentos_select_own" ON public.pagamentos
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ─────────────────── Políticas: conteúdo publicado ───────────────────

CREATE POLICY "disciplinas_publico" ON public.disciplinas
  FOR SELECT TO authenticated, anon USING (ativa = true);
CREATE POLICY "topicos_publico" ON public.topicos
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "blocos_publicados" ON public.blocos
  FOR SELECT TO authenticated USING (status = 'publicado');
CREATE POLICY "passos_de_bloco_publicado" ON public.passos
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.blocos b WHERE b.id = passos.bloco_id AND b.status = 'publicado')
  );
CREATE POLICY "questoes_publicadas" ON public.questoes
  FOR SELECT TO authenticated USING (status = 'publicado');
CREATE POLICY "cartoes_publicados" ON public.cartoes
  FOR SELECT TO authenticated USING (status = 'publicado');
CREATE POLICY "planos_ativos" ON public.planos
  FOR SELECT TO authenticated, anon USING (ativo = true);

-- papeis, cupons, auditoria: sem policy para authenticated/anon
-- (service_role sempre bypassa RLS; admin UI usa service_role via API routes).
