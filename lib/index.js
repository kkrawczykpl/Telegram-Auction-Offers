"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var config_1 = require("./config");
var functions_1 = require("./functions");
// Check for database file
functions_1.isDatabaseFile();
// Creates an instance of Telegraf 
var bot = new telegraf_1.Telegraf(config_1.config.BOT_TOKEN);
// Handle /start command
bot.start(function (ctx) { return ctx.reply('Cześć!'); });
// Handle /help command
bot.help(function (ctx) { return ctx.reply(config_1.config.help_msg); });
// Handle /pomoc command
bot.command('pomoc', function (ctx) { return ctx.reply('Lista komend:\n/dodaj <url (olx | otomoto | allegro)>'); });
/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/
bot.command('dodaj', function (ctx) {
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
        if (service.success) {
            ctx.reply("Tw\u00F3j link wygl\u0105da na poprawny. Wybrany serwis: " + service.name);
            var task_1 = { chat_id: ctx.from.id, service: service.name || "SERVICE_NULL", url: url };
            functions_1.saveTaskToDatabase(task_1, function (err) {
                if (!err) {
                    ctx.reply("Zapisa\u0142em!\nSerwis: " + task_1.service + "\nLink: " + task_1.url);
                }
                else {
                    ctx.reply('Nie mogłem zapisać, wystąpił błąd. Spróbuj ponownie.');
                }
            });
        }
        else {
            ctx.reply(service.message || "Wystąpił błąd. Spróbuj ponownie.");
        }
    }
});
bot.command('test', function (ctx) {
    // nothing right now
});
// Launch bot
bot.launch();
