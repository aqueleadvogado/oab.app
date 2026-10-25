import Link from "next/link";
import { FormLogin } from "@/components/auth/form-login";
import { BotaoGoogle } from "@/components/auth/botao-google";

export const metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Entrar</h1>
        <p className="mt-2 text-muted">Bem-vindo de volta.</p>
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

      <FormLogin />

      <p className="text-sm text-center text-muted">
        Novo por aqui?{" "}
        <Link href="/cadastro" className="text-blue hover:underline font-bold">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
