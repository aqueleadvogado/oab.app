"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { entrarComSenha, enviarLinkMagico } from "@/lib/auth/actions";

type Modo = "senha" | "link_magico";

export function FormLogin() {
  const [modo, setModo] = useState<Modo>("senha");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const r =
        modo === "senha"
          ? await entrarComSenha(formData)
          : await enviarLinkMagico(formData);
      if (!r.ok) setErro(r.erro);
    });
  }

  return (
    <form action={onSubmit} className="space-y-4" noValidate>
      <div className="flex gap-2 p-1 bg-lavender rounded-[10px]">
        <button
          type="button"
          onClick={() => setModo("senha")}
          className={`flex-1 py-1.5 text-sm font-bold font-display rounded-md transition-colors ${
            modo === "senha" ? "bg-white text-navy shadow" : "text-muted"
          }`}
        >
          Senha
        </button>
        <button
          type="button"
          onClick={() => setModo("link_magico")}
          className={`flex-1 py-1.5 text-sm font-bold font-display rounded-md transition-colors ${
            modo === "link_magico" ? "bg-white text-navy shadow" : "text-muted"
          }`}
        >
          Link no e-mail
        </button>
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

      {modo === "senha" && (
        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      )}

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {erro}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pendente}>
        {pendente
          ? "Enviando..."
          : modo === "senha"
            ? "Entrar"
            : "Enviar link no e-mail"}
      </Button>

      {modo === "senha" && (
        <p className="text-sm text-center">
          <a href="/recuperar" className="text-blue hover:underline">
            Esqueci a senha
          </a>
        </p>
      )}
    </form>
  );
}
