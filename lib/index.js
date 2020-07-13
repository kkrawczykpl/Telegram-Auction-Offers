"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var functions_1 = require("./functions");
var help_1 = require("./commands/help");
var start_1 = require("./commands/start");
var bot_1 = require("./helpers/bot");
// Check for database file
functions_1.isDatabaseFile(function (err) {
    if (err) {
        console.log("There was an error while trying to open the database file", err);
    }
    // Check for database file
    functions_1.runCronJob(config_1.config.check_time, bot_1.bot);
});
// Creates an instance of Telegraf 
// Handle /start command
start_1.setupStart(bot_1.bot);
// Handle /help && /pomoc command
help_1.setupHelp(bot_1.bot);
/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/
bot_1.bot.command('dodaj', function (ctx) {
    // Object is possibly 'undefined'
    if (ctx.message && ctx.message.text) {
        var url = functions_1.getUrlFromMessage(ctx.message.text);
        if (!url) {
            ctx.reply('Wprowadziłeś pusty link. Poprawny format:\n/dodaj <url (olx | otomoto | allegro)>.');
            return;
        }
        // ServiceResponse { success: boolean; message?: string; name?: string; }
        var service = functions_1.getServiceFromUrl(url);
        // URL and service are correct
        if (service.success && ctx.from) {
            ctx.reply("Tw\u00F3j link wygl\u0105da na poprawny. Wybrany serwis: " + service.name);
            var task_1 = { chat_id: ctx.from.id, service: service.name || "SERVICE_NULL", url: url, auctions: [] };
            functions_1.saveTaskToDatabase(task_1, function (err) {
                if (!err) {
                    ctx.reply("Zapisa\u0142em!\nSerwis: " + task_1.service + "\nLink: " + task_1.url);
                }
                else {
                    ctx.reply("Nie mog\u0142em zapisa\u0107, wyst\u0105pi\u0142 b\u0142\u0105d. Spr\u00F3buj ponownie. B\u0142\u0105d: " + err);
                }
            });
        }
        else {
            ctx.reply(service.message || "Wystąpił błąd. Spróbuj ponownie.");
        }
    }
});
// bot.telegram.sendMessage()
bot_1.bot.command('test', function (ctx) {
    // nothing right now
});
// Launch bot
bot_1.bot.launch();
