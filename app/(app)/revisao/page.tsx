import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Revisão" };
export const instant = false;

export default function RevisaoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full">
      <header className="mb-8">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Revisão espaçada
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Nada vencido por aqui</h1>
        <p className="mt-2 text-muted">
          Suas revisões aparecem quando chegar a hora de cada cartão.
        </p>
      </header>

      <Card>
        <CardBody>
          <p className="text-muted">
            Em breve: cartões a revisar hoje, com algoritmo que adapta o
            próximo intervalo pelo seu desempenho.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
