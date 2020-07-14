import { Task } from "../classes/task";
import { getOffersFromService } from "./offers";
import { getDatabase, saveDatabase } from "./database";


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



async function saveTaskToDatabase(task: Task) {
    let database = JSON.parse(getDatabase());
    database.tasks.push(task);
    database = JSON.stringify(database);
    await saveDatabase(database);
}


export { createTask, saveTaskToDatabase }