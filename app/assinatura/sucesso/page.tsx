import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pagamento aprovado — OAB em Blocos" };

export default function SucessoPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <Card>
        <CardHeader>
          <p className="font-mono text-xs text-green-700 uppercase tracking-widest">
            Pagamento aprovado
          </p>
          <h1 className="text-2xl mt-2">Boa, bem-vindo!</h1>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-6">
            Sua assinatura foi registrada. Em alguns segundos ela deve aparecer
            como ativa — se não aparecer, atualize a página de conta.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/trilha">Começar a estudar</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/conta">Ver minha conta</Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
