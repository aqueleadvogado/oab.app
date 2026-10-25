import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioLogadoComPapel } from "@/lib/admin/auth";

export const instant = false;
export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const u = await usuarioLogadoComPapel("admin");
  if (!u) redirect("/login?next=/admin");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-line bg-navy text-white px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display font-bold text-white">
              Admin
            </Link>
            <Link href="/admin/blocos" className="text-sm text-white/80 hover:text-white">
              Blocos em revisão
            </Link>
          </div>
          <Link href="/trilha" className="text-sm text-white/80 hover:text-white">
            ← Voltar ao app
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
