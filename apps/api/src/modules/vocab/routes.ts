import type { FastifyInstance } from "fastify";
import { prisma } from "@nativo/db";
import { reviewInput, type DueCard, type DueResponse } from "@nativo/shared";
import { findVocab } from "@nativo/content";
import { schedule, type Rating } from "@nativo/learning-engine";
import { requireAuth } from "../../plugins/auth.js";

export async function vocabRoutes(app: FastifyInstance) {
  app.get("/vocab/due", { preHandler: requireAuth }, async (req): Promise<DueResponse> => {
    const userId = req.userId!, now = new Date();
    const [rows, dueCount, total] = await Promise.all([
      prisma.vocabularyReview.findMany({ where: { userId, dueAt: { lte: now } }, orderBy: { dueAt: "asc" }, take: 20 }),
      prisma.vocabularyReview.count({ where: { userId, dueAt: { lte: now } } }),
      prisma.vocabularyReview.count({ where: { userId } }),
    ]);
    const cards = rows.flatMap((r): DueCard[] => {
      const v = findVocab(r.vocabId);
      // Le contexte change à chaque révision : « Estoy en casa » → « Me voy a casa » → « Quédate en casa »
      return v ? [{ vocabId: v.id, es: v.es, fr: v.fr, context: v.contexts[r.reps % v.contexts.length]!, isNew: r.reps === 0 }] : [];
    });
    return { cards, dueCount, total };
  });

  app.post<{ Params: { id: string } }>("/vocab/:id/review", { preHandler: requireAuth }, async (req, reply) => {
    const { rating } = reviewInput.parse(req.body);
    const where = { userId_vocabId: { userId: req.userId!, vocabId: req.params.id } };
    const card = await prisma.vocabularyReview.findUnique({ where });
    if (!card) return reply.code(404).send({ error: "not_found" });
    const next = schedule(card, rating as Rating);
    await prisma.vocabularyReview.update({
      where, data: { stability: next.stability, difficulty: next.difficulty, lapses: next.lapses, reps: next.reps, lastReviewAt: next.lastReviewAt, dueAt: next.dueAt },
    });
    return { dueAt: next.dueAt };
  });
}
