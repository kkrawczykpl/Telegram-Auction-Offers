"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help_1 = require("./commands/help");
var start_1 = require("./commands/start");
var add_1 = require("./commands/add");
var bot_1 = require("./helpers/bot");
var cron_1 = require("./helpers/cron");
var saved_1 = require("./commands/saved");
var delete_1 = require("./commands/delete");
// Handle /start command
start_1.setupStart(bot_1.bot);
// Handle /pomoc & /help command
help_1.setupHelp(bot_1.bot);
// Handle /dodaj & /add command
add_1.setupAdd(bot_1.bot);
/// Handle delete
delete_1.setupDelete(bot_1.bot);
// Handle /zapisane & /saved command
saved_1.setupSaved(bot_1.bot);
// Handle CRON job
cron_1.setupCronJob('*/5 * * * *', bot_1.bot);
// Launch bot
bot_1.bot.launch();
