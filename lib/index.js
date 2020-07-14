"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help_1 = require("./commands/help");
var start_1 = require("./commands/start");
var add_1 = require("./commands/add");
var bot_1 = require("./helpers/bot");
var cron_1 = require("./helpers/cron");
// Handle /start command
start_1.setupStart(bot_1.bot);
// Handle /help && /pomoc command
help_1.setupHelp(bot_1.bot);
// Handle /dodaj command
add_1.setupAdd(bot_1.bot);
cron_1.setupCronJob('*/5 * * * *', bot_1.bot);
// Launch bot
bot_1.bot.launch();
