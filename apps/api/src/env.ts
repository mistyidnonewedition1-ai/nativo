import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  SESSION_TTL_DAYS: z.coerce.number().default(30),
});
// Échoue au démarrage si la config est invalide : pas d'erreur obscure plus tard.
export const env = schema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
