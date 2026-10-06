-- CreateTable
CREATE TABLE "LessonProgress" (
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "responseMs" INTEGER NOT NULL,
    "errorTag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyReview" (
    "userId" TEXT NOT NULL,
    "vocabId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "stability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lastReviewAt" TIMESTAMP(3),

    CONSTRAINT "VocabularyReview_pkey" PRIMARY KEY ("userId","vocabId")
);

-- CreateIndex
CREATE INDEX "Answer_userId_lessonId_idx" ON "Answer"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "VocabularyReview_userId_dueAt_idx" ON "VocabularyReview"("userId", "dueAt");

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyReview" ADD CONSTRAINT "VocabularyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
