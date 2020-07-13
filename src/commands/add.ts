import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { checkMessage } from "../middlewares/checkMessage";
import { strings } from "../helpers/strings";
import { ServiceResponse } from "../classes/service.response";
import { Task } from "../classes/task";
import { getUrlFromMessage, getServiceFromUrl } from "../helpers/urls";

/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/

function setupAdd(bot: Telegraf<TelegrafContext>) {
    bot.command(['dodaj', 'add'], checkMessage, sendAdd);
}

function sendAdd(ctx: TelegrafContext) {
    const url: string = getUrlFromMessage(ctx.message!.text || "");

    if ( !url ) {
        ctx.reply(strings.empty_url);
        return;
    }

    const service: ServiceResponse = getServiceFromUrl(url);

    if (!service.successResult) {
        ctx.reply(service.messageResult || "Wystąpił błąd. Spróbuj ponownie.");
        return;
    }

    ctx.reply(`${strings.correct_url} ${service.nameResult}`);

    const task: Task = new Task()
                        .setChatId(ctx.from!.id)
                        .setService(service.nameResult || "")
                        .setUrl(url)
                        .setAuctions([]);

}

export { setupAdd }