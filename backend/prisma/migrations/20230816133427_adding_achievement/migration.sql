-- CreateTable
CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" CHAR(255) NOT NULL,
    "description" CHAR(255) NOT NULL,
    "picture" CHAR(255) NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchievementToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AchievementToProfile_AB_unique" ON "_AchievementToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_AchievementToProfile_B_index" ON "_AchievementToProfile"("B");

-- AddForeignKey
ALTER TABLE "_AchievementToProfile" ADD CONSTRAINT "_AchievementToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementToProfile" ADD CONSTRAINT "_AchievementToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
