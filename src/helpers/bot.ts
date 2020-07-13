import { Telegraf }  from 'telegraf';
import { TelegrafContext } from "telegraf/typings/context";
import { config } from "../config";

// Creates an instance of Telegraf 
const bot: Telegraf<TelegrafContext> = new Telegraf(config.BOT_TOKEN);

export { bot };