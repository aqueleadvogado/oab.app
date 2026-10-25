import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Confirmação de e-mail / link mágico. O Supabase pode mandar o usuário
 * para cá em dois formatos, dependendo do fluxo configurado:
 *   - PKCE (padrão novo):  ?code=...
 *   - OTP legacy:          ?token_hash=...&type=signup|magiclink|recovery
 * Tratamos os dois.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/trilha";

  const supabase = await createClient();

  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?erro=${encodeURIComponent(error.message)}`, request.url),
      );
    }
    return NextResponse.redirect(new URL(next, request.url));
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?erro=${encodeURIComponent(error.message)}`, request.url),
      );
    }
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL("/login?erro=link_invalido", request.url));
}
