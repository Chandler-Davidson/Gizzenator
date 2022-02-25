import { prisma } from 'database';

export async function fetchSection(req, resp) {
  resp.send(await findRandomSection());
}

export async function findRandomSection() {
  return getSectionFromBuffer();
}

function* getSectionFromBuffer() {
  const buffer = [];

  async function fillBuffer() {
    for (let i = 0; i < 5; i++)
      buffer.push(await findSection());
  }

  while (true) {
    if (buffer.length <= 1)
      fillBuffer();

    yield buffer.pop();
  }
}

async function findSection() {
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