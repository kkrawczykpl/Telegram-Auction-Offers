import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { strings } from "../helpers/strings";

function setupHelp(bot: Telegraf<TelegrafContext>) {
    bot.command(['help', 'pomoc'], sendHelp);
}

function sendHelp(ctx: TelegrafContext) {
    return ctx.replyWithMarkdown(strings.help);
}

export { setupHelp }