import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { checkMessage } from "../middlewares/checkMessage";
import { strings } from "../helpers/strings";
import { ServiceResponse } from "../classes/service.response";
import { Task } from "../classes/task";
import { getUrlFromMessage, getServiceFromUrl } from "../helpers/urls";
import { getOffersFromService } from "../helpers/offers";
import { createTask, saveTaskToDatabase } from "../helpers/tasks";

/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/

function setupAdd(bot: Telegraf<TelegrafContext>) {
    bot.command(['dodaj', 'add'], checkMessage, sendAdd);
}

async function sendAdd(ctx: TelegrafContext) {
    const url: string = getUrlFromMessage(ctx.message!.text || "");

    if ( !url ) { ctx.reply(strings.empty_url); return }

    const service: ServiceResponse = getServiceFromUrl(url);

    if (!service.successResult || !service.nameResult) {
        ctx.reply(service.messageResult || "Wystąpił błąd. Spróbuj ponownie.");
        return;
    }

    ctx.reply(`${strings.correct_url} ${service.nameResult}`);

    // ctx.from must be defined because checkMessage middleware checks it
    const task: Task = await createTask(ctx.from!.id, service.nameResult, url);

    saveTaskToDatabase(task);
}

export { setupAdd }