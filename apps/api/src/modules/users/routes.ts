import type { FastifyInstance } from "fastify";
import { prisma } from "@nativo/db";
import { profileInput, type MeResponse } from "@nativo/shared";
import { meanLevel } from "@nativo/learning-engine";
import { requireAuth } from "../../plugins/auth.js";

export async function userRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: requireAuth }, async (req): Promise<MeResponse> => {
    const u = await prisma.user.findUniqueOrThrow({
      where: { id: req.userId! },
      include: { profile: true, skillLevels: true },
    });
    const p = u.profile;
    const skills = u.skillLevels.map(({ skill, level, score, confidence }) => ({ skill, level, score, confidence }));
    return {
      id: u.id, email: u.email, plan: u.plan, skills,
      overall: skills.length ? meanLevel(skills.map((s) => s.score)) : null,
      profile: p && {
        goal: p.goal as never, dailyMinutes: p.dailyMinutes as never,
        targetRegion: p.targetRegion ?? undefined, uiLanguage: p.uiLanguage as never,
        immersionMode: p.immersionMode, a11y: p.a11y as never,
      },
    };
  });

  app.put("/profile", { preHandler: requireAuth }, async (req) => {
    const d = profileInput.parse(req.body);
    const data = { ...d, a11y: d.a11y ?? {} };
    await prisma.userProfile.upsert({
      where: { userId: req.userId! },
      create: { userId: req.userId!, ...data },
      update: data,
    });
    return { ok: true };
  });
}
