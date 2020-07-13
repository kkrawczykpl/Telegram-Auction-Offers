import { TelegrafContext } from "telegraf/typings/context";


async function checkMessage(ctx: TelegrafContext, next: () => any) {
    try {
        // Check if message and text exists
        if (!ctx.message || !ctx.message.text || !ctx.from) {
            return;
        }
        next();
    } catch (err) {
        console.log(err);
    }
}

export { checkMessage }