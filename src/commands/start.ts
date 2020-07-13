import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { strings } from "../helpers/strings";

function setupStart(bot: Telegraf<TelegrafContext>) {
    bot.command('start', sendStart);
}

function sendStart(ctx: TelegrafContext) {
    return ctx.replyWithMarkdown(strings.start);
}

export { setupStart }