"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdd = void 0;
var checkMessage_1 = require("../middlewares/checkMessage");
var strings_1 = require("../helpers/strings");
var urls_1 = require("../helpers/urls");
var tasks_1 = require("../helpers/tasks");
/**
 * Handle /dodaj command
 * Pattern: /dodaj <url> - where <url> leads to one of supported sites <olx.pl, otomoto.pl, allegro.pl>
*/
function setupAdd(bot) {
    bot.command(['dodaj', 'add'], checkMessage_1.checkMessage, sendAdd);
}
exports.setupAdd = setupAdd;
function sendAdd(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var url, service, task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = urls_1.getUrlFromMessage(ctx.message.text || "");
                    if (!url) {
                        ctx.reply(strings_1.strings.empty_url);
                        return [2 /*return*/];
                    }
                    service = urls_1.getServiceFromUrl(url);
                    if (!service.successResult || !service.nameResult) {
                        ctx.reply(service.messageResult || "Wystąpił błąd. Spróbuj ponownie.");
                        return [2 /*return*/];
                    }
                    ctx.reply(strings_1.strings.correct_url + " " + service.nameResult);
                    return [4 /*yield*/, tasks_1.createTask(ctx.from.id, service.nameResult, url)];
                case 1:
                    task = _a.sent();
                    tasks_1.saveTaskToDatabase(task);
                    return [2 /*return*/];
            }
        });
    });
}
