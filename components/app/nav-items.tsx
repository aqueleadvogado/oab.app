"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Map,
  Zap,
  Repeat,
  BookOpen,
  Settings,
  FileText,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; icone: LucideIcon; label: string };

const ITEMS: Item[] = [
  { href: "/trilha", icone: Map, label: "Trilha" },
  { href: "/materias", icone: LayoutGrid, label: "Matérias" },
  { href: "/rotina", icone: Zap, label: "Rotina" },
  { href: "/simulados", icone: FileText, label: "Provas" },
  { href: "/revisao", icone: Repeat, label: "Revisão" },
  { href: "/caderno", icone: BookOpen, label: "Caderno" },
  { href: "/conta", icone: Settings, label: "Conta" },
];

export function NavItems({ vertical }: { vertical: boolean }) {
  const pathname = usePathname();

  if (vertical) {
    return (
      <div className="space-y-1">
        {ITEMS.map(({ href, icone: Icone, label }) => {
          const ativo = isAtivo(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold font-display transition-colors ${
                ativo
                  ? "bg-blue text-white"
                  : "text-ink hover:bg-lavender"
              }`}
            >
              <Icone className="size-5" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-stretch justify-around">
      {ITEMS.map(({ href, icone: Icone, label }) => {
        const ativo = isAtivo(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold font-display transition-colors ${
              ativo ? "text-blue" : "text-muted"
            }`}
          >
            <Icone className="size-5" aria-hidden />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function isAtivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
