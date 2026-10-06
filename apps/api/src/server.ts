import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { env, isProd } from "./env.js";
import { csrfGuard } from "./plugins/auth.js";
import { authRoutes } from "./modules/auth/routes.js";
import { userRoutes } from "./modules/users/routes.js";
import { placementRoutes } from "./modules/placement/routes.js";
import { lessonRoutes } from "./modules/lessons/routes.js";
import { vocabRoutes } from "./modules/vocab/routes.js";

const app = Fastify({ logger: { level: isProd ? "info" : "debug" }, bodyLimit: 1_000_000 });

await app.register(helmet);
await app.register(cors, {
  origin: env.WEB_ORIGIN, credentials: true,
  allowedHeaders: ["content-type", "x-nativo-csrf"], methods: ["GET", "POST", "PUT", "DELETE"],
});
await app.register(cookie);
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" }); // global ; plus strict sur /auth

app.decorateRequest("userId", null);
app.addHook("onRequest", csrfGuard);

app.setErrorHandler((err, _req, reply) => {
  if (err instanceof ZodError) {
    return reply.code(400).send({ error: "validation", issues: err.flatten().fieldErrors });
  }
  app.log.error(err);
  const status = (err as { statusCode?: number }).statusCode ?? 500;
  return reply.code(status).send({ error: status === 500 ? "internal" : (err as Error).message });
});

app.get("/health", async () => ({ ok: true }));
await app.register(authRoutes, { prefix: "/v1" });
await app.register(userRoutes, { prefix: "/v1" });
await app.register(placementRoutes, { prefix: "/v1" });
await app.register(lessonRoutes, { prefix: "/v1" });
await app.register(vocabRoutes, { prefix: "/v1" });

await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
