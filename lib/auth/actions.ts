"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; erro: string };

/** Monta a URL base a partir do request (funciona em dev e prod). */
async function baseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function cadastrar(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();

  if (!email || !senha) return { ok: false, erro: "Preencha e-mail e senha." };
  if (senha.length < 8) return { ok: false, erro: "A senha precisa ter pelo menos 8 caracteres." };

  const supabase = await createClient();
  const origin = await baseUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome },
      emailRedirectTo: `${origin}/auth/confirmar`,
    },
  });

  if (error) return { ok: false, erro: error.message };

  redirect("/verificar-email");
}

export async function entrarComSenha(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) return { ok: false, erro: "Preencha e-mail e senha." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) return { ok: false, erro: "E-mail ou senha incorretos." };

  revalidatePath("/", "layout");
  redirect("/trilha");
}

export async function enviarLinkMagico(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { ok: false, erro: "Informe o e-mail." };

  const supabase = await createClient();
  const origin = await baseUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/confirmar` },
  });

  if (error) return { ok: false, erro: error.message };

  redirect("/verificar-email");
}

export async function pedirResetSenha(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { ok: false, erro: "Informe o e-mail." };

  const supabase = await createClient();
  const origin = await baseUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirmar?next=/conta`,
  });

  if (error) return { ok: false, erro: error.message };

  redirect("/verificar-email");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function entrarComGoogle(): Promise<ActionResult> {
  const supabase = await createClient();
  const origin = await baseUrl();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error) return { ok: false, erro: error.message };
  if (data?.url) redirect(data.url);
  return { ok: false, erro: "Google OAuth não configurado." };
}
