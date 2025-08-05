import { CronJob, validateCronExpression } from 'cron';
import { checkStreamings } from '../services/Twitch';

const cronTimeExpression = '0 * * * * *'; // Every minute

const validation = validateCronExpression(cronTimeExpression);

if (!validation.valid) {
  throw new Error(`Invalid cron expression: ${validation.error}`);
}

function cronJobHandler() {
  console.log('Cron job started');
  checkStreamings()
    .then(() => console.log('Cron job completed successfully'))
    .catch(err => console.error('Error during cron job execution:', err));
}

export const job = new CronJob(
  cronTimeExpression,
  cronJobHandler,
  null, // onComplete
  false, // start
  'Europe/Madrid', // timezone
);