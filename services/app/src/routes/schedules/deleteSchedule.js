import { prisma } from 'database';
import { removeJob } from '../../lib/scheduling.js'

export async function deleteSchedule(req, resp) {
  const { channelId } = req.params;
  const deletedSchedule = await persistGuild(parseInt(channelId));

  const { expression } = deletedSchedule.schedule;
  removeJob(expression, channelId);
  resp.code(200).send();
}

async function persistGuild(channelId) {
  const channel = await prisma.channel.findUnique({
    where: {
      discordChannelId: channelId
    }
  });

  if (!channel)
    return;

  try {
    return prisma.channel.delete({
      where: {
        discordChannelId: channelId
      },
      include: {
        schedule: true
      }
    });
  } catch (err) {
    console.error(err);
  }
}
