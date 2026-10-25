"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { atualizarPreferenciasAcessibilidade } from "@/lib/perfil/actions";
import type { PrefsAcessibilidade } from "@/lib/perfil/actions";

export function FormAcessibilidade({ prefs }: { prefs: PrefsAcessibilidade }) {
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setErro(null);
    setSalvo(false);
    startTransition(async () => {
      const r = await atualizarPreferenciasAcessibilidade(formData);
      if (!r.ok) setErro(r.erro);
      else setSalvo(true);
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div>
        <Label>Tamanho da fonte</Label>
        <div className="flex gap-2 mt-2">
          {(["menor", "normal", "maior"] as const).map((v) => (
            <label
              key={v}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-navy-2 border border-line rounded-md cursor-pointer hover:bg-lavender has-[:checked]:bg-blue has-[:checked]:text-white"
            >
              <input
                type="radio"
                name="tamanho_fonte"
                value={v}
                defaultChecked={(prefs.tamanhoFonte ?? "normal") === v}
                className="sr-only"
              />
              <span className="text-sm capitalize font-bold">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Tema</Label>
        <div className="flex gap-2 mt-2">
          {(["claro", "escuro", "sistema"] as const).map((v) => (
            <label
              key={v}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-navy-2 border border-line rounded-md cursor-pointer hover:bg-lavender has-[:checked]:bg-blue has-[:checked]:text-white"
            >
              <input
                type="radio"
                name="tema"
                value={v}
                defaultChecked={(prefs.tema ?? "sistema") === v}
                className="sr-only"
              />
              <span className="text-sm capitalize font-bold">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Espaçamento</Label>
        <div className="flex gap-2 mt-2">
          {(["normal", "amplo"] as const).map((v) => (
            <label
              key={v}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-navy-2 border border-line rounded-md cursor-pointer hover:bg-lavender has-[:checked]:bg-blue has-[:checked]:text-white"
            >
              <input
                type="radio"
                name="espacamento"
                value={v}
                defaultChecked={(prefs.espacamento ?? "normal") === v}
                className="sr-only"
              />
              <span className="text-sm capitalize font-bold">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            name: "fonte_legivel",
            label: "Fonte extra legível (para dislexia/TDAH)",
            checked: prefs.fonteLegivel ?? false,
          },
          {
            name: "alto_contraste",
            label: "Alto contraste",
            checked: prefs.altoContraste ?? false,
          },
          {
            name: "reduzir_animacoes",
            label: "Reduzir animações",
            checked: prefs.reduzirAnimacoes ?? false,
          },
          {
            name: "modo_foco",
            label:
              "Modo foco (esconde tudo que não for o passo atual durante o estudo)",
            checked: prefs.modoFoco ?? false,
          },
        ].map((opt) => (
          <label
            key={opt.name}
            className="flex items-start gap-3 px-3 py-2 bg-white dark:bg-navy-2 border border-line rounded-md cursor-pointer hover:bg-lavender"
          >
            <input
              type="checkbox"
              name={opt.name}
              defaultChecked={opt.checked}
              className="size-4 mt-0.5 accent-blue"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}
      {salvo && !erro && (
        <p className="text-sm text-navy bg-mint px-3 py-2 rounded-md">
          ✓ Preferências salvas
        </p>
      )}

      <Button type="submit" disabled={pendente}>
        {pendente ? "Salvando..." : "Salvar preferências"}
      </Button>
    </form>
  );
}
