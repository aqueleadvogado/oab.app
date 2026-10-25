import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Caderno de erros" };
export const instant = false;

export default function CadernoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 w-full">
      <header className="mb-8">
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          Caderno
        </p>
        <h1 className="text-3xl md:text-4xl mt-2">Caderno de erros</h1>
        <p className="mt-2 text-muted">
          As questões que você errou ficam agrupadas aqui para você rever.
        </p>
      </header>

      <Card>
        <CardBody>
          <p className="text-muted">
            Em breve: lista por disciplina, filtro por tipo de erro e botão
            para refazer em modo revisão.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
