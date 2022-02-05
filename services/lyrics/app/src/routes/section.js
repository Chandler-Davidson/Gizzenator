import PrismaClient from "@prisma/client";
const prisma = new PrismaClient.PrismaClient();

export async function section(req, resp) {
  const sectionsCount = await prisma.section.count();
  const skip = Math.floor(Math.random() * sectionsCount);
  const section = await findRandomSection(skip);
  resp.send(section);
}

function findRandomSection(skip) {
  return prisma.section.findFirst({
    take: 1, skip: skip,
    include: {
      song: {
        include: {
          artist: true
        }
      }
    }
  });
}