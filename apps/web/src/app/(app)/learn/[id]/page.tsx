import { LessonPlayer } from "@/components/LessonPlayer";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  return <LessonPlayer id={(await params).id} />;
}
