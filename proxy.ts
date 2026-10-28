import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { db } from "@/lib/db";
import { assinaturas } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";

const ROTAS_PROTEGIDAS = [
  /^\/trilha(?:\/|$)/,
  /^\/estudo(?:\/|$)/,
  /^\/revisao(?:\/|$)/,
  /^\/simulados(?:\/|$)/,
  /^\/caderno(?:\/|$)/,
  /^\/materias(?:\/|$)/,
];

const ROTAS_PUBLICAS = [
  "/",
  "/assinar",
  "/assinatura/sucesso",
  "/assinatura/falha",
  "/assinatura/pendente",
  "/auth/",
  "/login",
  "/cadastro",
  "/design",
  "/api/",
];

function isPublicRoute(pathname: string): boolean {
  return ROTAS_PUBLICAS.some((rota) => pathname.startsWith(rota));
}

function isProtectedRoute(pathname: string): boolean {
  return ROTAS_PROTEGIDAS.some((regex) => regex.test(pathname));
}

async function temAssinaturaaAtiva(userId: string): Promise<boolean> {
  const agora = new Date();
  const [assinatura] = await db
    .select()
    .from(assinaturas)
    .where(
      and(
        eq(assinaturas.userId, userId),
        eq(assinaturas.status, "ativo"),
        gt(assinaturas.fim, agora),
      ),
    )
    .limit(1);
  return !!assinatura;
}

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  // Gate de assinatura: rotas protegidas exigem pagamento
  const pathname = request.nextUrl.pathname;

  if (isPublicRoute(pathname)) {
    return response;
  }

  if (!isProtectedRoute(pathname)) {
    return response;
  }

  // Rota protegida — verificar assinatura
  const url = new URL(request.url);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {}, // noop em middleware
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Não autenticado? Redirecionar pra login
  if (!user) {
    return NextResponse.redirect(
      new URL(`/cadastro?next=${encodeURIComponent(pathname)}`, request.url),
    );
  }

  // Autenticado mas sem assinatura ativa?
  const temAssinatura = await temAssinaturaaAtiva(user.id);
  if (!temAssinatura) {
    return NextResponse.redirect(
      new URL(`/assinar?volta_de=${encodeURIComponent(pathname)}`, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Roda em tudo, exceto:
     * - _next/static (assets estáticos)
     * - _next/image (otimização de imagem)
     * - favicon / ícones gerados
     * - manifest / sw
     */
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|icon-192.png|icon-512.png|icon-maskable.png|manifest.webmanifest|sw.js).*)",
  ],
};
