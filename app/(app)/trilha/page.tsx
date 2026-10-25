import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Trilha" };
export const instant = false;

export default async function TrilhaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // O layout já garante usuário logado; esta leitura é só para o nome.
  const [perfil] = await db
    .select({ nome: profiles.nome })
    .from(profiles)
    .where(eq(profiles.id, user!.id))
    .limit(1);

  const nome = perfil?.nome ?? user!.email?.split("@")[0] ?? "";

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full">
      <header className="mb-8">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Minha trilha
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Oi, {nome} 👋</h1>
        <p className="mt-2 text-muted">
          Seu próximo passo aparece aqui. O motor de estudo ainda está sendo
          montado.
        </p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-xl">Comece pelo essencial</h2>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-4">
            Antes do primeiro bloco, faça o check-in de energia na Rotina.
            O app usa isso para montar seu plano do dia.
          </p>
          <Button asChild>
            <Link href="/rotina">Fazer check-in</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
