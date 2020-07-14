"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
var telegraf_1 = require("telegraf");
var config_1 = require("../config");
// Creates an instance of Telegraf 
var bot = new telegraf_1.Telegraf(config_1.config.BOT_TOKEN);
exports.bot = bot;
