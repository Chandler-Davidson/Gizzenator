import { isValidCron } from 'cron-validator';
import { SchedulingRepository } from "../lib/schedulingRepository.js";

const schedulingRepo = new SchedulingRepository();
schedulingRepo.init();

export async function updateSchedule(req, resp) {
  // Todo: Clean cron before using
  const { cronExpression, channelId } = req.body;

  if (!isValidCron(cronExpression)) {
    resp.code(400).send({ message: "Invalid cron expression." });
    return;
  }

  await schedulingRepo.set(cronExpression, channelId);

  resp.code(200).send();
}

export async function deleteSchedule(req, resp) {
  const { channelId } = req.params;

  await schedulingRepo.remove(channelId);

  resp.code(200).send();
}
