"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHelp = void 0;
var strings_1 = require("../helpers/strings");
function setupHelp(bot) {
    bot.command(['help', 'pomoc'], sendHelp);
}
exports.setupHelp = setupHelp;
function sendHelp(ctx) {
    return ctx.replyWithMarkdown(strings_1.strings.help);
}
