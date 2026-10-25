import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { BlocoCard } from "@/components/ui/bloco-card";
import { Cronometro } from "@/components/ui/cronometro";

/**
 * Página interna de validação visual do design system.
 * Fica disponível em /design apenas em desenvolvimento e revisão de UI.
 * Será removida ou protegida antes do lançamento.
 */
export default function DesignPage() {
  const cores = [
    "navy",
    "navy-2",
    "paper",
    "ink",
    "muted",
    "line",
    "blue",
    "mint",
    "lavender",
  ];
  const disciplinas = [
    "etica",
    "constitucional",
    "civil",
    "processo-civil",
    "penal",
    "processo-penal",
    "administrativo",
    "trabalho",
    "tributario",
    "empresarial",
    "eleitoral",
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 flex-1">
      <header className="mb-12">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          Interno
        </p>
        <h1 className="text-4xl mt-2">Design System · OAB em Blocos</h1>
        <p className="mt-3 text-muted max-w-2xl">
          Validação visual dos tokens, componentes e identidade do produto. Esta
          página não vai ao ar.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Tipografia</h2>
        <Card>
          <CardBody>
            <p className="font-mono text-xs text-muted uppercase tracking-widest">
              Display · Bricolage Grotesque
            </p>
            <p className="font-display text-5xl font-bold text-navy mt-1">
              Estude em blocos.
            </p>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mt-6">
              Body · Atkinson Hyperlegible
            </p>
            <p className="text-lg mt-1 max-w-2xl">
              O jabuti vermelho, dos pampas, cuspiu farelo de milho na queixada
              da jararaca gigante. Pena que a frase não tem sentido jurídico.
            </p>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mt-6">
              Mono · JetBrains Mono
            </p>
            <p className="font-mono text-base mt-1">
              CPC 300 · tutela de urgência · 15:00
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Paleta — base</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {cores.map((c) => (
            <div key={c} className="text-center">
              <div
                className="h-20 rounded-[10px] border border-line"
                style={{ background: `var(--color-${c})` }}
              />
              <p className="mt-2 font-mono text-xs">{c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Paleta — disciplinas</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {disciplinas.map((c) => (
            <div key={c} className="text-center">
              <div
                className="h-16 rounded-[10px] border border-line"
                style={{ background: `var(--color-${c})` }}
              />
              <p className="mt-2 font-mono text-[10px]">{c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Botões</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Pequeno</Button>
          <Button>Padrão</Button>
          <Button size="lg">Grande</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Perigo</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Tags</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Tag>neutro</Tag>
          <Tag tom="sucesso">concluído</Tag>
          <Tag tom="aviso">revisar</Tag>
          <Tag tom="info">novo</Tag>
          <Tag tom="disciplina" cor="etica">
            ética
          </Tag>
          <Tag tom="disciplina" cor="civil">
            civil
          </Tag>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Blocos</h2>
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
            concluido
          />
          <BlocoCard
            disciplina="Civil"
            cor="civil"
            titulo="Prescrição e decadência"
            minutos={15}
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Cronômetro (prévia visual)</h2>
        <div className="flex flex-wrap gap-10 items-start">
          <Cronometro
            segundosTotais={900}
            segundosRestantes={720}
            rotulo="80% restante"
          />
          <Cronometro
            segundosTotais={900}
            segundosRestantes={420}
            rotulo="metade"
          />
          <Cronometro
            segundosTotais={900}
            segundosRestantes={60}
            rotulo="final"
          />
        </div>
      </section>
    </main>
  );
}
