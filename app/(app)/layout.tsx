import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NavItems } from "@/components/app/nav-items";
import { LogOut } from "lucide-react";

export const instant = false;

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [perfil] = await db
    .select({ nome: profiles.nome, email: profiles.email })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const nome =
    perfil?.nome ?? user.email?.split("@")[0] ?? "Estudante";
  const email = perfil?.email ?? user.email ?? "";

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-line">
        <div className="p-5 border-b border-line">
          <Link
            href="/trilha"
            className="font-display text-lg font-bold text-navy block"
          >
            OAB em Blocos
          </Link>
        </div>
        <nav className="flex-1 p-3">
          <NavItems vertical />
        </nav>
        <div className="p-3 border-t border-line space-y-1">
          <Link
            href="/conta"
            className="block px-3 py-2 rounded-md hover:bg-lavender text-sm"
          >
            <div className="font-bold text-navy truncate">{nome}</div>
            <div className="text-xs text-muted truncate">{email}</div>
          </Link>
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted hover:bg-lavender hover:text-ink transition-colors"
            >
              <LogOut className="size-4" aria-hidden />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0 min-w-0">
        {children}
      </div>

      {/* Bottom nav (mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-paper border-t border-line z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <NavItems vertical={false} />
      </nav>
    </div>
  );
}
