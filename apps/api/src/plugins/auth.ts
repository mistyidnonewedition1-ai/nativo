import { createHash, randomBytes } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@nativo/db";
import { env, isProd } from "../env.js";

export const COOKIE = "nativo_sid";
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

declare module "fastify" {
  interface FastifyRequest { userId: string | null }
}

export async function startSession(userId: string, reply: FastifyReply) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 864e5);
  await prisma.authSession.create({ data: { userId, tokenHash: sha256(token), expiresAt } });
  reply.setCookie(COOKIE, token, {
    httpOnly: true, secure: isProd, sameSite: "lax", path: "/", expires: expiresAt,
  });
}

export async function endSession(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies[COOKIE];
  if (token) await prisma.authSession.deleteMany({ where: { tokenHash: sha256(token) } });
  reply.clearCookie(COOKIE, { path: "/" });
}

/** preHandler : charge req.userId ou répond 401. */
export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const token = req.cookies[COOKIE];
  const session = token
    ? await prisma.authSession.findUnique({ where: { tokenHash: sha256(token) } })
    : null;
  if (!session || session.expiresAt < new Date()) {
    return reply.code(401).send({ error: "unauthenticated" });
  }
  req.userId = session.userId;
}

/** CSRF : les mutations exigent un en-tête personnalisé, impossible à poser depuis un formulaire tiers. */
export async function csrfGuard(req: FastifyRequest, reply: FastifyReply) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  if (req.headers["x-nativo-csrf"] !== "1") return reply.code(403).send({ error: "csrf" });
}
