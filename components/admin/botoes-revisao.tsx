"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { aprovarBloco, reprovarBloco } from "@/lib/admin/actions";

export function BotoesRevisao({ blocoId }: { blocoId: string }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  function aprovar() {
    setErro(null);
    startTransition(async () => {
      const r = await aprovarBloco(blocoId);
      if (!r.ok) setErro(r.erro);
      else router.push("/admin/blocos");
    });
  }

  function reprovar() {
    const motivo = window.prompt(
      "Motivo da reprovação (opcional) — o bloco volta para rascunho:",
    );
    setErro(null);
    startTransition(async () => {
      const r = await reprovarBloco(blocoId, motivo ?? undefined);
      if (!r.ok) setErro(r.erro);
      else router.push("/admin/blocos");
    });
  }

  return (
    <div className="flex items-center gap-3">
      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md flex-1">
          {erro}
        </p>
      )}
      <Button variant="secondary" onClick={reprovar} disabled={pendente}>
        Reprovar
      </Button>
      <Button onClick={aprovar} disabled={pendente}>
        {pendente ? "Processando..." : "Aprovar e publicar"}
      </Button>
    </div>
  );
}
