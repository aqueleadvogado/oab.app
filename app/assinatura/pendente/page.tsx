import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pagamento em análise — OAB em Blocos" };

export default function PendentePage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <Card>
        <CardHeader>
          <p className="font-mono text-xs text-amber-700 uppercase tracking-widest">
            Pagamento em análise
          </p>
          <h1 className="text-2xl mt-2">Estamos aguardando a confirmação</h1>
        </CardHeader>
        <CardBody>
          <p className="text-muted mb-4">
            Pix e boleto podem levar alguns minutos (ou horas) para serem
            confirmados pelo Mercado Pago. Assim que a confirmação chegar,
            sua assinatura é ativada automaticamente.
          </p>
          <p className="text-muted mb-6">
            Você pode fechar essa tela — vamos avisar por e-mail quando estiver
            tudo certo.
          </p>
          <Button variant="secondary" asChild>
            <Link href="/conta">Ir para minha conta</Link>
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
