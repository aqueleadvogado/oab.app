import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Bloco concluído" };
export const instant = false;

export default function ConcluidoPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16 w-full">
      <Card>
        <CardBody>
          <div className="mx-auto size-16 rounded-full bg-mint flex items-center justify-center text-3xl mb-6">
            🎉
          </div>
          <h1 className="text-3xl text-center mb-3">Bloco concluído</h1>
          <p className="text-center text-muted mb-8">
            Seu progresso foi salvo. Se errou alguma questão, ela volta
            amanhã na revisão.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/trilha">Voltar para a trilha</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/rotina">Ver meu plano</Link>
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
