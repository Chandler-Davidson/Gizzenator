import { SchedulingRepository } from "../lib/schedulingRepository.js";

const schedulingRepo = new SchedulingRepository();
schedulingRepo.init();

export async function updateSchedule(req, resp) {
  // Todo: Clean cron before using
  const { cronExpression, channelId } = req.body;
  const [isAllowed, reason] = isCronJobAllowed(cronExpression);

  if (!isAllowed) {
    resp.code(400).send({ message: reason });
  }

  await schedulingRepo.set(cronExpression, channelId);

  resp.code(200).send();
}

export async function deleteSchedule(req, resp) {
  const { channelId } = req.params;

  await schedulingRepo.remove(channelId);

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