import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
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
