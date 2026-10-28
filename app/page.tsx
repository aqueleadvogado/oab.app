import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlocoCard } from "@/components/ui/bloco-card";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-5xl mx-auto w-full">
        <p className="font-mono text-xs tracking-widest text-muted uppercase mb-6">
          1ª fase · Exame de Ordem
        </p>
        <h1 className="text-4xl md:text-6xl leading-[1.05] max-w-3xl">
          Estude para a OAB em blocos de{" "}
          <span className="text-blue">10 a 25 minutos</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl">
          Troca de matéria antes do tédio. Cronômetro visível. Revisão que chega
          sozinha. Feito para quem tem dificuldade de ficar horas em uma coisa
          só.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/assinar">Começar agora — R$ 97 por ano</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/design">Ver o método</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted">
          Site em construção. Lançamento previsto conforme a próxima edição do
          Exame de Ordem.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl mb-8">Como são os blocos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BlocoCard
            disciplina="Ética"
            cor="etica"
            titulo="Atividades privativas do advogado"
            minutos={15}
          />
          <BlocoCard
            disciplina="Constitucional"
            cor="constitucional"
            titulo="Controle de constitucionalidade"
            minutos={20}
          />
          <BlocoCard
            disciplina="Civil"
            cor="civil"
            titulo="Prescrição e decadência"
            minutos={15}
          />
          <BlocoCard
            disciplina="Penal"
            cor="penal"
            titulo="Dolo, culpa e preterdolo"
            minutos={15}
          />
          <BlocoCard
            disciplina="Trabalho"
            cor="trabalho"
            titulo="Prescrição trabalhista"
            minutos={10}
          />
          <BlocoCard
            disciplina="Tributário"
            cor="tributario"
            titulo="Imunidades"
            minutos={15}
          />
        </div>
      </section>
    </main>
  );
}
