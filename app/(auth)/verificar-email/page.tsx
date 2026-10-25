import Link from "next/link";

export const metadata = {
  title: "Verifique seu e-mail",
};

export default function VerificarEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto size-16 rounded-full bg-mint flex items-center justify-center text-3xl">
        ✉️
      </div>
      <div>
        <h1 className="text-3xl">Olha a caixa de entrada</h1>
        <p className="mt-3 text-muted">
          Mandamos um link para o seu e-mail. Clique nele para continuar.
        </p>
      </div>
      <div className="rounded-[14px] bg-lavender p-4 text-sm text-left">
        <p className="font-bold text-navy mb-1">Não chegou?</p>
        <ul className="text-muted space-y-1 list-disc list-inside">
          <li>Confira a pasta de spam / lixo eletrônico</li>
          <li>Veja se o e-mail está correto</li>
          <li>Aguarde 1-2 minutos e volte aqui</li>
        </ul>
      </div>
      <p className="text-sm text-muted">
        <Link href="/login" className="text-blue hover:underline font-bold">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
