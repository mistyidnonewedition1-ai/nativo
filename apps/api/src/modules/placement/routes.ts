import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@nativo/db";
import { placementAnswerInput, type PlacementItem, type PlacementStep } from "@nativo/shared";
import {
  BANK, PER_SKILL, PLACEMENT_SKILLS, applyAnswer, buildResult, newState, nextItem,
  type BankItem, type PlacementState,
} from "@nativo/learning-engine";
import { requireAuth } from "../../plugins/auth.js";

const TOTAL = PER_SKILL * PLACEMENT_SKILLS.length;

function toPublic(i: BankItem): PlacementItem {
  const options = [...i.options];
  for (let k = options.length - 1; k > 0; k--) { // Fisher-Yates : la bonne réponse n'est jamais en position fixe
    const j = Math.floor(Math.random() * (k + 1));
    [options[k], options[j]] = [options[j]!, options[k]!];
  }
  return { id: i.id, skill: i.skill, level: i.level, prompt: i.prompt, audioText: i.audioText, options };
}

export async function placementRoutes(app: FastifyInstance) {
  app.post("/placement/start", { preHandler: requireAuth }, async (req): Promise<PlacementStep & { sessionId: string }> => {
    const userId = req.userId!;
    await prisma.placementSession.updateMany({ where: { userId, status: "IN_PROGRESS" }, data: { status: "ABANDONED" } });
    const st = newState();
    const item = nextItem(st)!;
    st.current = item.id;
    const s = await prisma.placementSession.create({ data: { userId, state: st as never } });
    return { sessionId: s.id, progress: { done: 0, total: TOTAL }, item: toPublic(item), result: null };
  });

  app.post("/placement/answer", { preHandler: requireAuth }, async (req, reply): Promise<PlacementStep | void> => {
    const { sessionId, itemId, choice, ms } = placementAnswerInput.parse(req.body);
    const userId = req.userId!;
    const session = await prisma.placementSession.findFirst({ where: { id: sessionId, userId, status: "IN_PROGRESS" } });
    if (!session) return reply.code(404).send({ error: "session_not_found" });
    const st = session.state as unknown as PlacementState;
    const item = BANK.find((i) => i.id === itemId);
    if (!item || st.current !== itemId) return reply.code(409).send({ error: "wrong_item" });

    applyAnswer(st, item, choice === item.options[0], ms);
    const next = nextItem(st);
    const progress = { done: st.answers.length, total: TOTAL };
    if (next) {
      st.current = next.id;
      await prisma.placementSession.update({ where: { id: session.id }, data: { state: st as never } });
      return { progress, item: toPublic(next), result: null };
    }

    st.current = null;
    const result = buildResult(st);
    await prisma.$transaction([
      ...result.skills.map((s) => prisma.userSkillLevel.upsert({
        where: { userId_skill: { userId, skill: s.skill } },
        create: { userId, ...s }, update: { level: s.level, score: s.score, confidence: s.confidence },
      })),
      prisma.placementSession.update({
        where: { id: session.id }, data: { status: "COMPLETED", completedAt: new Date(), state: st as never },
      }),
    ]);
    return { progress, item: null, result };
  });
}
