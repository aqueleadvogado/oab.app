import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormBasico } from "@/components/perfil/form-basico";
import { FormAcessibilidade } from "@/components/perfil/form-acessibilidade";
import type { PrefsAcessibilidade } from "@/lib/perfil/actions";
import { getAssinaturaAtiva } from "@/lib/pagamento";

export const metadata = { title: "Minha conta" };
export const instant = false;

export default async function ContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/conta");

  const [perfil] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const prefs: PrefsAcessibilidade =
    (perfil?.prefsAcessibilidade as PrefsAcessibilidade) ?? {};

  const assinaturaAtiva = await getAssinaturaAtiva(user.id);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full">
      <header className="mb-10">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Minha conta
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Perfil e preferências</h1>
        <p className="mt-2 text-muted">
          Tudo que ajusta aqui é usado para montar seu plano de estudo e sua
          experiência no app.
        </p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl">Assinatura</h2>
          </CardHeader>
          <CardBody>
            {assinaturaAtiva && assinaturaAtiva.fim ? (
              <>
                <p className="text-sm">
                  Status: <strong className="text-green-700">Ativa</strong>
                </p>
                <p className="text-sm text-muted mt-1">
                  Vale até{" "}
                  <strong>
                    {new Date(assinaturaAtiva.fim).toLocaleDateString("pt-BR")}
                  </strong>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted mb-4">
                  Você ainda não tem assinatura ativa. O acesso ao conteúdo é
                  anual.
                </p>
                <Button asChild>
                  <Link href="/assinar">Ver plano — R$ 97/ano</Link>
                </Button>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl">Perfil</h2>
          </CardHeader>
          <CardBody>
            <FormBasico
              nome={perfil?.nome ?? null}
              email={perfil?.email ?? user.email ?? null}
              dataProva={
                perfil?.dataProva ? String(perfil.dataProva) : null
              }
              horarioLembrete={perfil?.horarioLembrete ?? null}
              materiasPrioritarias={
                (perfil?.materiasPrioritarias as string[]) ?? []
              }
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl">Como você quer que o app apareça</h2>
            <p className="text-sm text-muted mt-1">
              Preferências de leitura e foco. Nenhuma dessas informações é
              diagnóstico — nunca pergunte, salve ou compartilhe isso aqui.
            </p>
          </CardHeader>
          <CardBody>
            <FormAcessibilidade prefs={prefs} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl">Encerrar sessão</h2>
          </CardHeader>
          <CardBody>
            <form action="/auth/logout" method="POST">
              <Button variant="secondary" type="submit">
                Sair desta conta
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
