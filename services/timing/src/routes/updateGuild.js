import { addJob } from '../scheduling.js';

export async function upsertGuild(prisma, req, resp) {
  // Todo: Clean cron before using
  const { cronExpression, guildId } = req.body;
  const [isAllowed, reason] = isCronJobAllowed(cronExpression);

  if (!isAllowed) {
    resp.code(400).send({ message: reason });
  }

  await persistTiming(prisma, cronExpression, guildId);
  addJob(cronExpression, guildId);

  resp.code(200).send();
}

function isCronJobAllowed(cron) {
  const parts = cron.split(' ');

  if (parts.length < 5)
    return [false, 'Invalid Cron expression'];

  if (parts.length > 5)
    return [false, 'Maximum frequency is once per minute.'];

  return [true];
}

function persistTiming(prisma, cronExpression, guildId) {
  return prisma.timing.upsert({
    where: {
      expression: cronExpression,
    },
    update: {
      channels: {
        connectOrCreate: [
          {
            create: { discordGuildId: guildId },
            where: { discordGuildId: guildId },
          }
        ]
      }
    },
    create: {
      expression: cronExpression,
      channels: {
        connectOrCreate: [
          {
            create: { discordGuildId: guildId },
            where: { discordGuildId: guildId },
          }
        ]
      }
    }
  });
}

