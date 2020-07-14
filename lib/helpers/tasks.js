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
exports.deleteTask = exports.getTasksByChatId = exports.compareTasks = exports.getAllTasks = exports.saveTaskToDatabase = exports.createTask = void 0;
var task_1 = require("../classes/task");
var offers_1 = require("./offers");
var database_1 = require("./database");
var strings_1 = require("./strings");
/**
 * Creates Task
 * @param chatId
 * @param service
 * @param url
 * @param [auctions]
 * @returns  Task
 */
function createTask(chatId, service, url, auctions) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!auctions) return [3 /*break*/, 2];
                    return [4 /*yield*/, offers_1.getOffersFromService(service, url)];
                case 1:
                    auctions = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, new task_1.Task()
                        .setChatId(chatId)
                        .setService(service)
                        .setUrl(url)
                        .setAuctions(auctions)];
            }
        });
    });
}
exports.createTask = createTask;
/**
 * Saves task to database
 * @param task
 */
function saveTaskToDatabase(task) {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = JSON.parse(database_1.getDatabase());
                    database.tasks.push(task);
                    database = JSON.stringify(database);
                    return [4 /*yield*/, database_1.saveDatabase(database)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveTaskToDatabase = saveTaskToDatabase;
/**
 * Gets all tasks
 * @returns Task[]
 */
function getAllTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var tasks;
        return __generator(this, function (_a) {
            tasks = JSON.parse(database_1.getDatabase()).tasks;
            return [2 /*return*/, tasks];
        });
    });
}
exports.getAllTasks = getAllTasks;
/**
 * Gets tasks by chat id
 * @param chat_id
 * @returns tasks by chat id
 */
function getTasksByChatId(chat_id) {
    return __awaiter(this, void 0, void 0, function () {
        var tasks;
        return __generator(this, function (_a) {
            try {
                tasks = JSON.parse(database_1.getDatabase()).tasks;
                return [2 /*return*/, tasks.filter(function (task) { return task.chatId = chat_id; })];
            }
            catch (err) {
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTasksByChatId = getTasksByChatId;
function deleteTask(chat_id, url) {
    return __awaiter(this, void 0, void 0, function () {
        var database, tasks, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = JSON.parse(database_1.getDatabase());
                    tasks = database.tasks;
                    for (index in tasks) {
                        if (tasks[index].chatId === chat_id) {
                            if (tasks[index].url === url) {
                                delete database.tasks[index];
                            }
                        }
                    }
                    database = JSON.stringify(database);
                    return [4 /*yield*/, database_1.saveDatabase(database)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteTask = deleteTask;
/**
 * Compares tasks
 * @param id
 * @param task
 * @param urls
 * @param bot
 */
function compareTasks(id, task, urls, bot) {
    return __awaiter(this, void 0, void 0, function () {
        var news, _i, news_1, newone, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(task.chatId && task.auctions)) return [3 /*break*/, 2];
                    news = urls.filter(function (n) { return !(new Set(task.auctions)).has(n); });
                    console.log(news);
                    for (_i = 0, news_1 = news; _i < news_1.length; _i++) {
                        newone = news_1[_i];
                        message = strings_1.strings.new_offer.replace('((service))', task.service).replace('((link))', newone);
                        bot.telegram.sendMessage(task.chatId, message);
                        task.auctions.unshift(newone);
                    }
                    return [4 /*yield*/, updateTaskAuctions(id, task.auctions)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.compareTasks = compareTasks;
/**
 * Updates task auctions
 * @param index
 * @param updatedAuctions
 */
function updateTaskAuctions(index, updatedAuctions) {
    return __awaiter(this, void 0, void 0, function () {
        var database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = JSON.parse(database_1.getDatabase());
                    database.tasks[index].auctions = updatedAuctions;
                    database = JSON.stringify(database);
                    return [4 /*yield*/, database_1.saveDatabase(database)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
