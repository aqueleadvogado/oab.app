import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

// .env.local tem prioridade (padrão do Next.js). .env é fallback.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL_DIRECT (ou DATABASE_URL) ausente. Preencha o .env.local.",
  );
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  schemaFilter: ["public"],
  casing: "snake_case",
  verbose: true,
  strict: true,
} satisfies Config;
