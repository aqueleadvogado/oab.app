"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BotaoAssinar({ planoSlug }: { planoSlug: string }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function iniciarCheckout() {
    setCarregando(true);
    setErro(null);
    try {
      const resp = await fetch("/api/pagamento/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planoSlug }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.detalhe ?? data?.erro ?? "Falha ao iniciar pagamento");
      }

      if (data.jaAssinante) {
        window.location.href = "/trilha";
        return;
      }

      if (!data.redirectUrl) throw new Error("Mercado Pago não retornou URL.");

      window.location.href = data.redirectUrl;
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
      setCarregando(false);
    }
  }

  return (
    <div>
      <Button size="lg" onClick={iniciarCheckout} disabled={carregando}>
        {carregando ? "Abrindo pagamento..." : "Assinar agora"}
      </Button>
      {erro && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
