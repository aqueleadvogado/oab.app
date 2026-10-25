import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL ausente. Preencha .env.local com a connection string pooler do Supabase.",
  );
}

// Supabase pooler (porta 6543) usa modo "transaction" — evita prepared statements.
const sql = postgres(url, { prepare: false });

export const db = drizzle(sql, { schema, casing: "snake_case" });
export { schema };
