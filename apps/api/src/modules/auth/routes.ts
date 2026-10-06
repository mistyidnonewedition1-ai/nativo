import type { FastifyInstance } from "fastify";
import argon2 from "argon2";
import { prisma } from "@nativo/db";
import { loginInput, signupInput } from "@nativo/shared";
import { endSession, startSession } from "../../plugins/auth.js";

const hashOpts = { type: argon2.argon2id } as const;
let dummyHash: Promise<string> | undefined; // égalise le temps de réponse si l'e-mail n'existe pas

export async function authRoutes(app: FastifyInstance) {
  const strict = { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } };

  app.post("/auth/signup", strict, async (req, reply) => {
    const { email, password } = signupInput.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (exists) return reply.code(409).send({ error: "email_taken" });
    const user = await prisma.user.create({
      data: { email, passwordHash: await argon2.hash(password, hashOpts) },
    });
    await startSession(user.id, reply);
    return reply.code(201).send({ id: user.id });
  });

  app.post("/auth/login", strict, async (req, reply) => {
    const { email, password } = loginInput.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    dummyHash ??= argon2.hash("dummy-password", hashOpts);
    const ok = await argon2.verify(user?.passwordHash ?? (await dummyHash), password);
    if (!user || !ok) return reply.code(401).send({ error: "invalid_credentials" });
    await startSession(user.id, reply);
    return { id: user.id };
  });

  app.post("/auth/logout", async (req, reply) => {
    await endSession(req, reply);
    return { ok: true };
  });
}
