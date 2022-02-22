import { prisma } from 'database';
import { addJob } from '../../lib/scheduling.js'

export async function updateSchedule(req, resp) {
  try {
    // Todo: Clean cron before using
    const { cronExpression, channelId } = req.body;
    const [isAllowed, reason] = isCronJobAllowed(cronExpression);

    if (!isAllowed) {
      resp.code(400).send({ message: reason });
    }

    await persistSchedule(cronExpression, parseInt(channelId));
    addJob(cronExpression, channelId);
  } catch (err) {
    console.error(err);
  }

  resp.code(200).send();
}

function isCronJobAllowed(cron) {
  const parts = cron.split(' ');

  if (parts.length < 5)
    return [false, 'Invalid Cron expression'];

  // if (parts.length > 5)
  //   return [false, 'Maximum frequency is once per minute.'];

  return [true];
}

async function persistSchedule(cronExpression, channelId) {
  let expression = await prisma.schedule.findUnique({ where: { expression: cronExpression } });
  let channel = await prisma.channel.findUnique({ where: { discordChannelId: channelId } });

  if (!expression)
    expression = await prisma.schedule.create({ data: { expression: cronExpression } });

  if (!channel)
    channel = await prisma.channel.upsert({
      where: {
        discordChannelId: channelId
      },
      update: {
        schedule: {
          connect: {
            id: expression.id
          }
        }
      },
      create: {
        discordChannelId: channelId,
        schedule: {
          connect: {
            id: expression.id
          }
        }
      }
    });
}
