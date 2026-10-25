"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { pedirResetSenha } from "@/lib/auth/actions";

export default function RecuperarPage() {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const r = await pedirResetSenha(formData);
      if (!r.ok) setErro(r.erro);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Esqueci a senha</h1>
        <p className="mt-2 text-muted">
          Vamos mandar um link no seu e-mail para você escolher uma nova senha.
        </p>
      </div>

      <form action={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {erro}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pendente}>
          {pendente ? "Enviando..." : "Enviar link"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted">
        <Link href="/login" className="text-blue hover:underline font-bold">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
