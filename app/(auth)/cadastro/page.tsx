import Link from "next/link";
import { FormCadastro } from "@/components/auth/form-cadastro";
import { BotaoGoogle } from "@/components/auth/botao-google";

export const metadata = {
  title: "Criar conta",
};

export default function CadastroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Criar conta</h1>
        <p className="mt-2 text-muted">
          Em 30 segundos você começa a estudar.
        </p>
      </div>

      <BotaoGoogle />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-paper px-3 text-xs font-mono text-muted uppercase tracking-widest">
            ou com e-mail
          </span>
        </div>
      </div>

      <FormCadastro />

      <p className="text-sm text-center text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="text-blue hover:underline font-bold">
          Entrar
        </Link>
      </p>
    </div>
  );
}
