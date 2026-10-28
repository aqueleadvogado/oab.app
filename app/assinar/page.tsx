import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAssinaturaAtiva, getPlanoPorSlug } from "@/lib/pagamento";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BotaoAssinar } from "@/components/assinar/botao-assinar";

export const metadata = { title: "Assinar — OAB em Blocos" };
export const dynamic = "force-dynamic";

export default async function AssinarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cadastro?next=/assinar");

  const [plano, ativa] = await Promise.all([
    getPlanoPorSlug("anual"),
    getAssinaturaAtiva(user.id),
  ]);

  if (!plano) {
    return (
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-2xl mb-4">Plano indisponível</h1>
        <p className="text-muted">
          Nenhum plano ativo encontrado. Avise o suporte: suporte@oab.app.br
        </p>
      </main>
    );
  }

  if (ativa) {
    const fim = ativa.fim ? new Date(ativa.fim).toLocaleDateString("pt-BR") : "—";
    return (
      <main className="max-w-xl mx-auto px-6 py-16">
        <Card>
          <CardHeader>
            <h1 className="text-2xl">Você já é assinante</h1>
          </CardHeader>
          <CardBody>
            <p className="text-muted mb-6">
              Sua assinatura está ativa até <strong>{fim}</strong>.
            </p>
            <Button asChild>
              <Link href="/trilha">Ir para minha trilha</Link>
            </Button>
          </CardBody>
        </Card>
      </main>
    );
  }

  const preco = (plano.precoCentavos / 100).toFixed(2).replace(".", ",");

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-10 text-center">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Assinatura anual
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">R$ {preco} por ano</h1>
        <p className="mt-3 text-muted">
          Acesso completo por 12 meses. Pagamento único, sem renovação
          automática — você decide se renova no fim do período.
        </p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-xl">O que entra na assinatura</h2>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2 text-sm">
            <li>• Trilha completa das 13 disciplinas da 1ª fase</li>
            <li>• Blocos de 10 a 25 minutos com mapa, macete, pegadinha e questão</li>
            <li>• Revisão espaçada (algoritmo SM-2) por cartões e questões erradas</li>
            <li>• Questões reais da FGV classificadas por tópico</li>
            <li>• Modo adaptativo por nível de energia (verde/amarelo/vermelho)</li>
            <li>• Cronômetro visível e tela de foco</li>
          </ul>

          <div className="mt-8">
            <BotaoAssinar planoSlug="anual" />
          </div>

          <p className="mt-4 text-xs text-muted">
            Pagamento processado pelo Mercado Pago (cartão, Pix ou boleto). Você
            será redirecionado para o ambiente seguro deles.
          </p>
        </CardBody>
      </Card>

      <p className="mt-8 text-center text-xs text-muted">
        OAB em Blocos é plataforma independente, sem vínculo com CFOAB ou FGV.
      </p>
    </main>
  );
}
