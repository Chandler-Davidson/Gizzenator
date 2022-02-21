import { prisma } from '../../lib/prisma.js';
import { removeJob } from '../../lib/scheduling.js'

export async function deleteSchedule(req, resp) {
  const { guildId } = req.params;
  const deletedSchedule = await persistGuild(guildId);

  const { expression } = deletedSchedule.schedule;
  removeJob(expression, guildId);
  resp.code(200).send();
}

function persistGuild(guildId) {
  return prisma.guild.delete({
    where: {
      discordGuildId: guildId
    },
    include: {
      schedule: true
    }
  });
}
