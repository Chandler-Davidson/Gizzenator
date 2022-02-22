import { prisma } from 'database';

export async function fetchSection(req, resp) {
  resp.send(await findRandomSection());
}

export async function findRandomSection() {
  const sectionsCount = await prisma.section.count();
  const skip = Math.floor(Math.random() * sectionsCount);

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