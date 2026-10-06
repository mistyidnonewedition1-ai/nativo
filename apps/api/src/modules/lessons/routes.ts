import type { FastifyInstance } from "fastify";
import { prisma } from "@nativo/db";
import { answerInput, type AnswerFeedback, type CompleteResponse, type ExercisePublic, type LessonPublic, type LessonSummary } from "@nativo/shared";
import { LESSONS, exercisesOf, findExercise, findLesson, type Ex } from "@nativo/content";
import { requireAuth } from "../../plugins/auth.js";

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let k = r.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [r[k], r[j]] = [r[j]!, r[k]!]; }
  return r;
}
const pub = (id: string, e: Ex): ExercisePublic =>
  ({ id, kind: e.kind, skill: e.skill, prompt: e.prompt, audioText: e.audioText, options: shuffle(e.options) });

export async function lessonRoutes(app: FastifyInstance) {
  app.get("/path", { preHandler: requireAuth }, async (req): Promise<LessonSummary[]> => {
    const done = new Map((await prisma.lessonProgress.findMany({ where: { userId: req.userId! } })).map((p) => [p.lessonId, p.score]));
    return LESSONS.map((l, i) => ({
      id: l.id, title: l.title, level: l.level, objectives: l.objectives,
      status: done.has(l.id) ? "done" : i === 0 || done.has(LESSONS[i - 1]!.id) ? "open" : "locked",
      score: done.get(l.id),
    }));
  });

  app.get<{ Params: { id: string } }>("/lessons/:id", { preHandler: requireAuth }, async (req, reply): Promise<LessonPublic | void> => {
    const l = findLesson(req.params.id);
    if (!l) return reply.code(404).send({ error: "not_found" });
    const ex = exercisesOf(l);
    return {
      id: l.id, title: l.title, level: l.level, objectives: l.objectives, intro: l.intro,
      dialogue: l.dialogue, vocab: l.vocab, explain: l.explain,
      exercises: ex.filter((e) => e.id.includes(":e")).map((e) => pub(e.id, e.ex)),
      quiz: ex.filter((e) => e.id.includes(":q")).map((e) => pub(e.id, e.ex)),
    };
  });

  app.post<{ Params: { id: string } }>("/lessons/:id/answer", { preHandler: requireAuth }, async (req, reply): Promise<AnswerFeedback | void> => {
    const { exerciseId, choice, ms } = answerInput.parse(req.body);
    const hit = findExercise(exerciseId);
    if (!hit || hit.lesson.id !== req.params.id) return reply.code(404).send({ error: "exercise_not_found" });
    const correct = choice === hit.ex.options[0];
    await prisma.answer.create({
      data: { userId: req.userId!, lessonId: hit.lesson.id, exerciseId, correct, responseMs: ms, errorTag: correct ? null : (hit.ex.errorTag ?? null) },
    });
    return { correct, answer: hit.ex.options[0], tip: correct ? undefined : hit.ex.tip };
  });

  app.post<{ Params: { id: string } }>("/lessons/:id/complete", { preHandler: requireAuth }, async (req, reply): Promise<CompleteResponse | void> => {
    const l = findLesson(req.params.id);
    if (!l) return reply.code(404).send({ error: "not_found" });
    const userId = req.userId!;
    const latest = new Map<string, boolean>();
    for (const a of await prisma.answer.findMany({ where: { userId, lessonId: l.id }, orderBy: { createdAt: "asc" } })) latest.set(a.exerciseId, a.correct);
    const ids = exercisesOf(l).map((e) => e.id);
    if (ids.some((id) => !latest.has(id))) return reply.code(409).send({ error: "incomplete" });
    const score = ids.filter((id) => latest.get(id)).length / ids.length;
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: l.id } },
      create: { userId, lessonId: l.id, score }, update: { score, completedAt: new Date() },
    });
    const created = await prisma.vocabularyReview.createMany({
      data: l.vocab.map((v) => ({ userId, vocabId: v.id, lessonId: l.id })), skipDuplicates: true,
    });
    return { score, newCards: created.count };
  });
}
