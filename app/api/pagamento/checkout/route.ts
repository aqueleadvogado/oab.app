import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { iniciarCheckout } from "@/lib/pagamento";

export const dynamic = "force-dynamic";

/**
 * POST /api/pagamento/checkout
 * Body: { planoSlug: string }
 * Autenticado via sessão Supabase. Cria preferência MP e retorna URL de redirect.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ erro: "nao_autenticado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { planoSlug?: string };
  const planoSlug = body.planoSlug ?? "anual";

  const urlBase =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (request.headers.get("origin") ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`);

  try {
    const resultado = await iniciarCheckout({
      userId: user.id,
      email: user.email,
      nome: (user.user_metadata?.full_name as string | undefined) ?? null,
      planoSlug,
      urlBase,
    });

    if (resultado.jaAssinante) {
      return NextResponse.json({
        jaAssinante: true,
        fim: resultado.assinatura.fim,
      });
    }

    return NextResponse.json({
      redirectUrl: resultado.redirectUrl,
      assinaturaId: resultado.assinaturaId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[checkout] falhou:", msg);
    return NextResponse.json({ erro: "falha_checkout", detalhe: msg }, { status: 500 });
  }
}
