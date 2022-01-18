-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artistId" INTEGER NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_key" ON "Artist"("name");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
