import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { deleteTask } from "../helpers/tasks";
import { strings } from "../helpers/strings";

function setupDelete(bot: Telegraf<TelegrafContext>) {
    bot.action(['delete', 'usun'], async ( ctx ) => {
        if( ctx.callbackQuery && ctx.callbackQuery.message && ctx.callbackQuery.message.text && ctx.from ) {
            deleteTask( ctx.from.id, ctx.callbackQuery.message.text );
            ctx.replyWithMarkdown(strings.delete);
        }
    });
}


export { setupDelete }