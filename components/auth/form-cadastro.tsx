"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cadastrar } from "@/lib/auth/actions";

export function FormCadastro() {
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const r = await cadastrar(formData);
      if (!r.ok) setErro(r.erro);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="nome">Como quer ser chamado?</Label>
        <Input
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          placeholder="Primeiro nome"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="senha">Senha (mínimo 8 caracteres)</Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pendente}>
        {pendente ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-xs text-muted text-center">
        Ao criar conta você concorda com os Termos de Uso e com a Política de
        Privacidade. Não pergunte nem salve informação de saúde no perfil.
      </p>
    </form>
  );
}
