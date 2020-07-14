import { Task } from "../classes/task";
import { getOffersFromService } from "./offers";
import { getDatabase, saveDatabase } from "./database";
import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { url } from "inspector";
import { strings } from "./strings";


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
 * Gets tasks by chat id
 * @param chat_id 
 * @returns tasks by chat id 
 */
async function getTasksByChatId(chat_id: number): Promise<Task[]> {
    try {
        let tasks: Task[] = JSON.parse(getDatabase()).tasks;
        return tasks.filter( (task) => { return task.chatId = chat_id } );
    }catch(err) {
        return [];
    }
}

async function deleteTask(chat_id: number, url: string) {
    let database = JSON.parse(getDatabase());
    let tasks: Task[] = database.tasks;
    for(let index in tasks) {
        if (tasks[index].chatId === chat_id) {
            if(tasks[index].url === url) {
                delete database.tasks[index]
            }
        }
    }
    database = JSON.stringify(database);
    await saveDatabase(database);
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
            let message = strings.new_offer.replace('((service))', task.service!).replace('((link))', newone);
            bot.telegram.sendMessage(task.chatId, message);
            task.auctions.unshift(newone);
        }
        await updateTaskAuctions(id, task.auctions);
    }
}

/**
 * Updates task auctions
 * @param index 
 * @param updatedAuctions 
 */
async function updateTaskAuctions(index: number, updatedAuctions: string[]) {
    let database = JSON.parse(getDatabase());
    database.tasks[index].auctions = updatedAuctions;
    database = JSON.stringify(database);
    await saveDatabase(database);
}


export { createTask, saveTaskToDatabase, getAllTasks, compareTasks, getTasksByChatId, deleteTask }