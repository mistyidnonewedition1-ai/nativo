import type { AnswerFeedback, CompleteResponse, DueResponse, LessonPublic, LessonSummary, MeResponse, PlacementStep, ProfileInput } from "@nativo/shared";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/v1${path}`, {
    ...init,
    credentials: "include", // cookie de session HttpOnly
    headers: { "content-type": "application/json", "x-nativo-csrf": "1", ...init.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (body as { error?: string }).error ?? "error");
  return body as T;
}

export const api = {
  signup: (b: { email: string; password: string }) => request("/auth/signup", { method: "POST", body: JSON.stringify(b) }),
  login: (b: { email: string; password: string }) => request("/auth/login", { method: "POST", body: JSON.stringify(b) }),
  logout: () => request("/auth/logout", { method: "POST", body: "{}" }),
  me: () => request<MeResponse>("/me"),
  path: () => request<LessonSummary[]>("/path"),
  lesson: (id: string) => request<LessonPublic>(`/lessons/${id}`),
  answer: (lessonId: string, b: { exerciseId: string; choice: string | null; ms: number }) =>
    request<AnswerFeedback>(`/lessons/${lessonId}/answer`, { method: "POST", body: JSON.stringify(b) }),
  complete: (lessonId: string) => request<CompleteResponse>(`/lessons/${lessonId}/complete`, { method: "POST", body: "{}" }),
  vocabDue: () => request<DueResponse>("/vocab/due"),
  vocabReview: (id: string, rating: number) => request(`/vocab/${id}/review`, { method: "POST", body: JSON.stringify({ rating }) }),
  saveProfile: (b: ProfileInput) => request("/profile", { method: "PUT", body: JSON.stringify(b) }),
  placementStart: () => request<PlacementStep & { sessionId: string }>("/placement/start", { method: "POST", body: "{}" }),
  placementAnswer: (b: { sessionId: string; itemId: string; choice: string | null; ms: number }) =>
    request<PlacementStep>("/placement/answer", { method: "POST", body: JSON.stringify(b) }),
};
