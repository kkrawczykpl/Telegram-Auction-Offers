"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupStart = void 0;
var strings_1 = require("../helpers/strings");
function setupStart(bot) {
    bot.command('start', sendStart);
}
exports.setupStart = setupStart;
function sendStart(ctx) {
    return ctx.replyWithMarkdown(strings_1.strings.start);
}
