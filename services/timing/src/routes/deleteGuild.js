import { removeJob } from '../scheduling.js';

export async function deleteTiming(prisma, req, resp) {
  const { guildId } = req.body;
  const deletedTiming = await persistGuild(prisma, guildId);

  const { expression } = deletedTiming.timing;
  removeJob(expression, guildId);
  resp.code(200).send();
}

function persistGuild(prisma, guildId) {
  return prisma.channel.delete({
    where: {
      discordGuildId: guildId
    },
    include: {
      timing: true
    }
  });
}
