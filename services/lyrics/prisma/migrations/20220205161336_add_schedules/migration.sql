-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "discordGuildId" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "expression" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_discordGuildId_key" ON "Guild"("discordGuildId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_expression_key" ON "Schedule"("expression");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
