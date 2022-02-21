/*
  Warnings:

  - You are about to drop the `Guild` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_scheduleId_fkey";

-- DropTable
DROP TABLE "Guild";

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "discordChannelId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_discordChannelId_key" ON "Channel"("discordChannelId");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
