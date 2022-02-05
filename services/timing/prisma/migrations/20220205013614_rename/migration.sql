-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "discordGuildId" INTEGER NOT NULL,
    "timingId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timing" (
    "id" SERIAL NOT NULL,
    "expression" TEXT NOT NULL,

    CONSTRAINT "Timing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_discordGuildId_key" ON "Channel"("discordGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "Timing_expression_key" ON "Timing"("expression");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_timingId_fkey" FOREIGN KEY ("timingId") REFERENCES "Timing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
