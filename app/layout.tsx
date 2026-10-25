import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Atkinson_Hyperlegible,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Atkinson_Hyperlegible({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oab.app.br"),
  title: {
    default: "OAB em Blocos — Estude para o Exame de Ordem em blocos curtos",
    template: "%s · OAB em Blocos",
  },
  description:
    "Preparação para a 1ª fase do Exame de Ordem em blocos de 10 a 25 minutos. Troca de matéria antes do tédio, cronômetro visível e revisão que chega sozinha.",
  applicationName: "OAB em Blocos",
  authors: [{ name: "OAB em Blocos" }],
  keywords: [
    "OAB",
    "Exame de Ordem",
    "estudo",
    "TDAH",
    "blocos",
    "revisão espaçada",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://oab.app.br",
    siteName: "OAB em Blocos",
    title: "OAB em Blocos",
    description:
      "Estude para o Exame de Ordem em blocos curtos, com cor, cronômetro e revisão automática.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1326" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="bg-paper text-ink min-h-full flex flex-col font-body">
        {children}
      </body>
    </html>
  );
}
