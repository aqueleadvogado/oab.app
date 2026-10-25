import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Renova a sessão do Supabase a cada requisição (necessário em RSC).
 * Chamado pelo middleware.ts raiz.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Durante setup (.env.local ainda não preenchido) o middleware vira no-op
  // em vez de quebrar todas as rotas.
  if (!url || !anon) return response;

  const supabase = createServerClient(
    url,
    anon,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: NÃO coloque código entre createServerClient e getUser.
  // getUser revalida o cookie — qualquer outra lógica aqui pode gerar bug sutil.
  await supabase.auth.getUser();

  return response;
}
