import { Task } from "../classes/task";
import { getOffersFromService } from "./offers";
import { getDatabase, saveDatabase } from "./database";
import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";


/**
 * Creates Task
 * @param chatId 
 * @param service 
 * @param url 
 * @param [auctions] 
 * @returns  Task
 */
async function createTask(chatId: number, service: string, url: string, auctions?: string[]) {
    if (!auctions) {
        auctions = await getOffersFromService(service, url);
    }

    return new Task()
            .setChatId(chatId)
            .setService(service)
            .setUrl(url)
            .setAuctions(auctions!);
}


/**
 * Saves task to database
 * @param task 
 */
async function saveTaskToDatabase(task: Task) {
    let database = JSON.parse(getDatabase());
    database.tasks.push(task);
    database = JSON.stringify(database);
    await saveDatabase(database);
}

/**
 * Gets all tasks
 * @returns Task[] 
 */
async function getAllTasks(): Promise<Task[]> {
    let tasks: Task[] = JSON.parse(getDatabase()).tasks;
    return tasks;
}

/**
 * Compares tasks
 * @param id 
 * @param task 
 * @param urls 
 * @param bot 
 */
async function compareTasks(id:number, task: Task, urls: string[], bot: Telegraf<TelegrafContext>): Promise<void> {
    if( task.chatId && task.auctions )
    {
        let news = urls.filter( (n) => { return !(new Set(task.auctions)).has(n) } );
        console.log(news);
        for (let newone of news) {
            bot.telegram.sendMessage(task.chatId, `Psss, nowa oferta na ${task.service}!\nLink: ${newone}`);
            task.auctions.unshift(newone);
        }
        await updateTaskAuctions(id, task.auctions);
    }
}


async function updateTaskAuctions(index: number, updatedAuctions: string[]) {
    let database = JSON.parse(getDatabase());
    database.tasks[index].auctions = updatedAuctions;
    database = JSON.stringify(database);
    await saveDatabase(database);
}


export { createTask, saveTaskToDatabase, getAllTasks, compareTasks }