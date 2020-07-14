import { CronJob } from 'cron';
import { getAllTasks, compareTasks } from './tasks';
import { Task } from '../classes/task';
import { getOffersFromService } from './offers';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

function setupCronJob(interval: string, bot: Telegraf<TelegrafContext>) {
    const job = new CronJob(interval, async () => {
        console.log("----------------------");
        console.log("------ CRON JOB ------");
        console.log("----------------------");
        let tasks: Task[] = await getAllTasks();
        for(let task in tasks) {
            if (!tasks[task] || typeof tasks[task].service === undefined || typeof tasks[task].url === undefined) {
                break;
            }
            let auctions = await getOffersFromService(tasks[task].service as string, tasks[task].url as string);
            await compareTasks( parseInt(task), tasks[task], auctions, bot);
        }
    });
    job.start();
}

export { setupCronJob }