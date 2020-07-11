import { Telegraf, Markup, Extra }  from 'telegraf';
import { config } from './config';
import { TelegrafContext } from 'telegraf/typings/context';
import { ServiceResponse } from './interfaces/service.response';
import { getUrlFromMessage, getServiceFromUrl, isDatabaseFile, saveTaskToDatabase } from './functions';
import { Task } from './interfaces/task';


// Check for database file
isDatabaseFile();

// Creates an instance of Telegraf 
const bot: Telegraf<TelegrafContext> = new Telegraf(config.BOT_TOKEN);

// Handle /start command
bot.start( (ctx: TelegrafContext) => ctx.reply('Cześć!'));

// Handle /help command
bot.help( (ctx: TelegrafContext) => ctx.reply(config.help_msg))

// Handle /pomoc command
bot.command('pomoc', (ctx: TelegrafContext) => ctx.reply('Lista komend:\n/dodaj <url (olx | otomoto | allegro)>') );

/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/
bot.command('dodaj', (ctx: TelegrafContext) => {

    // Object is possibly 'undefined'
    if( ctx.message && ctx.message.text) {
        const url: string = getUrlFromMessage(ctx.message.text);
        if (!url) {
            ctx.reply('Wprowadziłeś pusty link. Poprawny format:\n/dodaj <url (olx | otomoto | allegro)>.');
            return;
        }

        // ServiceResponse { success: boolean; message?: string; name?: string; }
        const service: ServiceResponse = getServiceFromUrl(url);

        // URL and service are correct
        if (service.success) {
            ctx.reply(`Twój link wygląda na poprawny. Wybrany serwis: ${service.name}`);
            const task: Task = { chat_id: ctx.from!.id, service: service.name || "SERVICE_NULL", url: url};
            saveTaskToDatabase(task, (err) => {
                if ( !err ) {
                    ctx.reply(`Zapisałem!\nSerwis: ${task.service}\nLink: ${task.url}`);
                }else{
                    ctx.reply('Nie mogłem zapisać, wystąpił błąd. Spróbuj ponownie.');
                }
            })
        }
        else {
            ctx.reply(service.message || "Wystąpił błąd. Spróbuj ponownie.");
        }

    }
});

bot.command('test', (ctx: TelegrafContext) => {
    // nothing right now
});

// Launch bot
bot.launch()