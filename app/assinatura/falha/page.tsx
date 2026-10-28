import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pagamento não concluído — OAB em Blocos" };

export default function FalhaPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <Card>
        <CardHeader>
          <p className="font-mono text-xs text-red-700 uppercase tracking-widest">
            Pagamento não concluído
          </p>
          <h1 className="text-2xl mt-2">Algo deu errado no pagamento</h1>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-6">
            Pode ter sido cartão recusado, dados incorretos ou saldo
            insuficiente. Nada foi cobrado. Tente de novo quando puder.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/assinar">Tentar de novo</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/trilha">Voltar</Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
