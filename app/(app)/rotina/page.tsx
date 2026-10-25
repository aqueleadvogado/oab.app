import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Rotina" };
export const instant = false;

export default function RotinaPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full">
      <header className="mb-8">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Rotina
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Check-in de energia</h1>
        <p className="mt-2 text-muted">
          Como você está hoje? A resposta define o tamanho do seu plano.
        </p>
      </header>

      <Card>
        <CardBody>
          <p className="text-muted">
            Em breve: botões verde / amarelo / vermelho, geração do plano
            do dia, cronômetro visível e lixeira de distrações.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
