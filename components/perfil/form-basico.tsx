"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { atualizarPerfilBasico } from "@/lib/perfil/actions";
import { DISCIPLINAS_ESTATICAS } from "@/lib/disciplinas-estaticas";

type Props = {
  nome: string | null;
  email: string | null;
  dataProva: string | null;
  horarioLembrete: string | null;
  materiasPrioritarias: string[];
};

export function FormBasico(props: Props) {
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setErro(null);
    setSalvo(false);
    startTransition(async () => {
      const r = await atualizarPerfilBasico(formData);
      if (!r.ok) setErro(r.erro);
      else setSalvo(true);
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="nome">Como quer ser chamado?</Label>
        <Input
          id="nome"
          name="nome"
          defaultValue={props.nome ?? ""}
          autoComplete="name"
          placeholder="Primeiro nome"
        />
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          defaultValue={props.email ?? ""}
          disabled
          className="opacity-60 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-muted">
          Para trocar o e-mail, me avise — faço via suporte.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data_prova">Data da próxima prova</Label>
          <Input
            id="data_prova"
            name="data_prova"
            type="date"
            defaultValue={props.dataProva ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="horario_lembrete">Horário do lembrete</Label>
          <Input
            id="horario_lembrete"
            name="horario_lembrete"
            type="time"
            defaultValue={props.horarioLembrete ?? ""}
          />
        </div>
      </div>

      <div>
        <Label>Matérias prioritárias (as que você mais quer reforçar)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {DISCIPLINAS_ESTATICAS.map((d) => {
            const checked = props.materiasPrioritarias.includes(d.slug);
            return (
              <label
                key={d.slug}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-navy-2 border border-line rounded-md cursor-pointer hover:bg-lavender"
              >
                <input
                  type="checkbox"
                  name="materias_prioritarias"
                  value={d.slug}
                  defaultChecked={checked}
                  className="size-4 accent-blue"
                />
                <span className="text-sm">{d.nome}</span>
              </label>
            );
          })}
        </div>
      </div>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}
      {salvo && !erro && (
        <p className="text-sm text-navy bg-mint px-3 py-2 rounded-md">
          ✓ Alterações salvas
        </p>
      )}

      <Button type="submit" disabled={pendente}>
        {pendente ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
