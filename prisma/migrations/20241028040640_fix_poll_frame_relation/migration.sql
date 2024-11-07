/*
  Warnings:

  - Added the required column `updatedAt` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "votes" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Frame" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postUrl" TEXT NOT NULL,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Frame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Frame_pollId_key" ON "Frame"("pollId");

-- CreateIndex
CREATE INDEX "Frame_pollId_idx" ON "Frame"("pollId");

-- AddForeignKey
ALTER TABLE "Frame" ADD CONSTRAINT "Frame_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
