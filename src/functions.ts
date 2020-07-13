import { ServiceResponse } from './interfaces/service.response';
import fs from 'fs';
import { Task } from './interfaces/task';
import { CronJob } from 'cron';
import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';


/**
 * Gets URL from message
 * @param message (string)
 * @returns URL (string) 
 */
function getUrlFromMessage(message: string): string {
    message = message.replace(/\/dodaj/g, '').trim();
    return message;
}

/**
 * Gets service name from url
 * @param message (string)
 * @returns Object (service) 
 */
function getServiceFromUrl(message: string): ServiceResponse {

    // RegExp pattern: https:// + one of < (www.)otomoto.pl || (www.)olx.pl || (www.)allegro.pl> + /any_word (because we want link to somewhere, not the home page)
    const services: RegExpMatchArray | null = message.match(/(https:\/\/)(www.otomoto.pl|otomoto.pl|olx.pl|www.olx.pl|m.olx.pl|www.m.olx.pl|allegro.pl|www.allegro.pl)\/\w+/g);
    
    // Bad format - no service provided
    if (!services){
        return { success: false, message: "Nie znaleziono odpowiedniego linku. Obsługiwane formaty: olx.pl, www.olx.pl, otomoto.pl, www.otomoto.pl, allegro.pl, www.allegro.pl" };
    }
    // More than 1 URL provided
    else if ( services.length > 1 ) {
        return { success: false, message: "Link jest w niepoprawnej formie. Wykryto więcej niż jeden link, spróbuj ponownie" };
    }

    // Check the service to which the link is provided
    if( services[0].includes('olx.pl') ) {
        return { success: true, name: "OLX" };
    }
    else if (services[0].includes('otomoto.pl')) {
        return { success: true, name: "OtoMoto" };
    }
    else if (services[0].includes('allegro.pl')) {
        return { success: true, name: "Allegro" };
    }
    else {
        return { success: false, message: "Link jest w niepoprawnej formie. Wykryto więcej niż jeden link, spróbuj ponownie" };
    }

}

/**
 * Saves Task to database.json file
 * @param task (Task)
 * @param callback (function (err) )
 */
async function saveTaskToDatabase(task: Task, callback: { (err: NodeJS.ErrnoException | string | null): void } ){
    // Read database.json file
    fs.readFile('./database.json', 'utf-8', async (err, data) => {
        if ( err ) { console.log('There was an error while trying to read database file', err); callback(err); return }

        let auctions = await getOffersFromService(task.service, task.url);
        if (!auctions || auctions.length < 1) { callback('This link does not lead to an offers page.'); return }
        task.auctions = auctions;
        let database = JSON.parse(data);
        database.tasks.push(task);
        database = JSON.stringify(database);

        // Save database.json file
        fs.writeFile('./database.json', database, 'utf-8', (err) => {
            if ( err ) { console.log('There was an error while trying to save database file', err); callback(err); return }
            callback(null);
        });
    });
}

function compareTasks(id:number, tasks: Task, urls: string[], bot: Telegraf<TelegrafContext>) {
    let news = urls.filter( (n) => { return !(new Set(tasks.auctions)).has(n) } );
    console.log(news);
    for (let newone of news) {
        bot.telegram.sendMessage(tasks.chat_id, `Psss, nowa oferta na ${tasks.service}!\nLink: ${newone}`);
        tasks.auctions.unshift(newone);
    }
    updateTaskAuctions(id, tasks.auctions);
}


async function updateTaskAuctions(index: number, updatedAuctions: string[]) {

    fs.readFile('./database.json', 'utf-8', async (err, data) => {
        if ( err ) { console.log('There was an error while trying to read database file', err); return }

        let database = JSON.parse(data);
        database.tasks[index].auctions = updatedAuctions;
        database = JSON.stringify(database);

        // Save database.json file
        fs.writeFile('./database.json', database, 'utf-8', (err) => {
            if ( err ) { console.log('There was an error while trying to save database file', err); return; }
        });
    });
}


/**
 * Gets all tasks
 * @returns Task[]
 */
async function getAllTasks(): Promise<Task[]> {
    let data: string = fs.readFileSync('./database.json', 'utf-8');
    let tasks: Task[] = await JSON.parse(data).tasks;
    return tasks;
}


async function getOffersFromService(service: string, url: string): Promise<string[]> {
    let ret: string[] = [];
    try {
        const response = await axios.get(url);
        if ( response.status === 200) {
            switch(service) {
                case "OtoMoto":
                    ret = await OtoMotoParser(response);
                   break;
                case "OLX":
                   ret = await OLXParser(response);
                   break;
                case "Allegro":
                   break;
                    // @TODO;
                    // return AllegroParser(response);
                default:
                    ret = []
            }
        }

    } catch (exception){
        process.stderr.write(`ERROR received from ${url}: ${exception}\n`);
    }

    return ret;
}

/**
 * OtoMoto (Polish car auctions service) parser
 * @param response 
 * @returns URLS (string) array
 */
async function OtoMotoParser(response: AxiosResponse): Promise<string[]> {
    const html = response.data;
    const $ = cheerio.load(html);
    const cars = $('.offers.list > article').toArray();
    let urls: string[] = [];
    for(let car of cars) {
        urls.push(car.attribs["data-href"]);
    }
    return urls;
}


/**
 * OLX parser
 * @param response 
 * @returns URLS (string) array
 */
async function OLXParser(response: AxiosResponse): Promise<string[]> {
    const html = response.data;
    const $ = cheerio.load(html);
    const auctions = $('.marginright5.link.linkWithHash').toArray();
    let urls: string[] = [];

    for(let offer of auctions) {
        // URLs have different parameters depending on the time e.g "#hash;promoted". Just get rid of them
        let url: string | undefined =  offer.attribs["href"].split('.html', 1).shift();
        if(!url) {
            break;
        }
        urls.push(url + '.html');
    }

    return urls;
}


/**
 * Runs Cron Job
 * @param time (number)
 */
function runCronJob(time: number, bot: Telegraf<TelegrafContext>) {
    const job = new CronJob(`${time} * * * * *`, async () => {
        console.log("---------------------");
        let tasks = await getAllTasks();
        for(let task in tasks) {
            let urls = await getOffersFromService(tasks[task].service, tasks[task].url);
            compareTasks( parseInt(task), tasks[task], urls, bot);
        }
    });
    job.start();
}

/**
 * Checks for Database file, if file does not exist, it creates one
 */
function isDatabaseFile( callback: { (err: NodeJS.ErrnoException | null): void } ): void {
    fs.stat('./database.json', (err) => {

        if ( !err ) { console.log('Database file found'); callback(null); return };

        fs.writeFile('./database.json', '{ "tasks": [] }', 'utf-8', (err) => {
            if (err) { console.log('There was an error while trying to create database file.', err); callback(err); return };
            console.log('Database file created');
            callback(null);
        });
    });
}

export { getUrlFromMessage, getServiceFromUrl, saveTaskToDatabase, runCronJob, isDatabaseFile };