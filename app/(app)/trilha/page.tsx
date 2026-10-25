import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Trilha" };
// Página autenticada — não pré-renderiza (lê cookies de sessão).
export const instant = false;

export default async function TrilhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/trilha");

  const nome = (user.user_metadata?.nome as string) || user.email?.split("@")[0] || "";

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full">
      <header className="mb-10">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Minha trilha
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Oi, {nome} 👋</h1>
        <p className="mt-2 text-muted">
          Seu primeiro bloco começa aqui. O motor de estudo entra na próxima
          fase do desenvolvimento.
        </p>
      </header>

      <Card>
        <CardBody>
          <h2 className="text-xl mb-2">Conta criada com sucesso</h2>
          <p className="text-muted mb-4">
            A autenticação está funcionando. O conteúdo das aulas, os blocos
            interativos, o cronômetro e a revisão espaçada chegam na Fase 2.
          </p>
          <form action="/auth/logout" method="POST">
            <Button variant="secondary" type="submit">
              Sair
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}
