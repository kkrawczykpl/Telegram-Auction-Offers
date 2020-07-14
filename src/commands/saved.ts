import Telegraf, { Markup, Extra } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { getTasksByChatId } from "../helpers/tasks";
import { strings } from "../helpers/strings";

function setupSaved(bot: Telegraf<TelegrafContext>) {
    bot.command(['saved', 'zapisane'], sendSaved);
}

async function sendSaved(ctx: TelegrafContext) {
    if (!ctx.from) { return; }
    let tasks = await getTasksByChatId(ctx.from.id);
    if(!tasks || tasks.length < 1) { ctx.reply(strings.no_links_saved); return; }
    let urls = tasks.map( (task) => task.url );
    await ctx.replyWithMarkdown(strings.saved);
    
    for (let url of urls) {
        const keyboard = Markup.inlineKeyboard([
            Markup.callbackButton(strings.delete_btn, `delete`)
        ]);
        ctx.telegram.sendMessage(ctx.from.id, url as string, Extra.markup(keyboard));
    }
}

export { setupSaved }