import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-6 border-b border-line">
        <Link href="/" className="font-display text-xl font-bold text-navy">
          OAB em Blocos
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
