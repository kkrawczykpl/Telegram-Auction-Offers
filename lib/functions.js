"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseFile = exports.runCronJob = exports.saveTaskToDatabase = exports.getServiceFromUrl = exports.getUrlFromMessage = void 0;
var fs_1 = __importDefault(require("fs"));
var cron_1 = require("cron");
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
/**
 * Gets URL from message
 * @param message (string)
 * @returns URL (string)
 */
function getUrlFromMessage(message) {
    message = message.replace(/\/dodaj/g, '').trim();
    return message;
}
exports.getUrlFromMessage = getUrlFromMessage;
/**
 * Gets service name from url
 * @param message (string)
 * @returns Object (service)
 */
function getServiceFromUrl(message) {
    // RegExp pattern: https:// + one of < (www.)otomoto.pl || (www.)olx.pl || (www.)allegro.pl> + /any_word (because we want link to somewhere, not the home page)
    var services = message.match(/(https:\/\/)(www.otomoto.pl|otomoto.pl|olx.pl|www.olx.pl|m.olx.pl|www.m.olx.pl|allegro.pl|www.allegro.pl)\/\w+/g);
    // Bad format - no service provided
    if (!services) {
        return { success: false, message: "Nie znaleziono odpowiedniego linku. Obsługiwane formaty: olx.pl, www.olx.pl, otomoto.pl, www.otomoto.pl, allegro.pl, www.allegro.pl" };
    }
    // More than 1 URL provided
    else if (services.length > 1) {
        return { success: false, message: "Link jest w niepoprawnej formie. Wykryto więcej niż jeden link, spróbuj ponownie" };
    }
    // Check the service to which the link is provided
    if (services[0].includes('olx.pl')) {
        return { success: true, name: "OLX" };
    }
    else if (services[0].includes('otomoto.pl')) {
        return { success: true, name: "OtoMoto" };
    }
    else if (services[0].includes('allegro.pl')) {
        return { success: true, name: "Allegro" };
    }
    else {
        return { success: false, message: "Link jest w niepoprawnej formie. Wykryto więcej niż jeden link, spróbuj ponownie" };
    }
}
exports.getServiceFromUrl = getServiceFromUrl;
/**
 * Saves Task to database.json file
 * @param task (Task)
 * @param callback (function (err) )
 */
function saveTaskToDatabase(task, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            // Read database.json file
            fs_1.default.readFile('./database.json', 'utf-8', function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                var auctions, database;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err) {
                                console.log('There was an error while trying to read database file', err);
                                callback(err);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, getOffersFromService(task.service, task.url)];
                        case 1:
                            auctions = _a.sent();
                            if (!auctions || auctions.length < 1) {
                                callback('This link does not lead to an offers page.');
                                return [2 /*return*/];
                            }
                            task.auctions = auctions;
                            database = JSON.parse(data);
                            database.tasks.push(task);
                            database = JSON.stringify(database);
                            // Save database.json file
                            fs_1.default.writeFile('./database.json', database, 'utf-8', function (err) {
                                if (err) {
                                    console.log('There was an error while trying to save database file', err);
                                    callback(err);
                                    return;
                                }
                                callback(null);
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.saveTaskToDatabase = saveTaskToDatabase;
function compareTasks(id, tasks, urls, bot) {
    var news = urls.filter(function (n) { return !(new Set(tasks.auctions)).has(n); });
    console.log(news);
    for (var _i = 0, news_1 = news; _i < news_1.length; _i++) {
        var newone = news_1[_i];
        bot.telegram.sendMessage(tasks.chat_id, "Psss, nowa oferta na " + tasks.service + "!\nLink: " + newone);
        tasks.auctions.unshift(newone);
    }
    updateTaskAuctions(id, tasks.auctions);
}
function updateTaskAuctions(index, updatedAuctions) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            fs_1.default.readFile('./database.json', 'utf-8', function (err, data) { return __awaiter(_this, void 0, void 0, function () {
                var database;
                return __generator(this, function (_a) {
                    if (err) {
                        console.log('There was an error while trying to read database file', err);
                        return [2 /*return*/];
                    }
                    database = JSON.parse(data);
                    database.tasks[index].auctions = updatedAuctions;
                    database = JSON.stringify(database);
                    // Save database.json file
                    fs_1.default.writeFile('./database.json', database, 'utf-8', function (err) {
                        if (err) {
                            console.log('There was an error while trying to save database file', err);
                            return;
                        }
                    });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
/**
 * Gets all tasks
 * @returns Task[]
 */
function getAllTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var data, tasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = fs_1.default.readFileSync('./database.json', 'utf-8');
                    return [4 /*yield*/, JSON.parse(data).tasks];
                case 1:
                    tasks = _a.sent();
                    return [2 /*return*/, tasks];
            }
        });
    });
}
function getOffersFromService(service, url) {
    return __awaiter(this, void 0, void 0, function () {
        var ret, response, _a, exception_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ret = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _b.sent();
                    if (!(response.status === 200)) return [3 /*break*/, 9];
                    _a = service;
                    switch (_a) {
                        case "OtoMoto": return [3 /*break*/, 3];
                        case "OLX": return [3 /*break*/, 5];
                        case "Allegro": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, OtoMotoParser(response)];
                case 4:
                    ret = _b.sent();
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, OLXParser(response)];
                case 6:
                    ret = _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [3 /*break*/, 9];
                case 8:
                    ret = [];
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    exception_1 = _b.sent();
                    process.stderr.write("ERROR received from " + url + ": " + exception_1 + "\n");
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, ret];
            }
        });
    });
}
/**
 * OtoMoto (Polish car auctions service) parser
 * @param response
 * @returns URLS (string) array
 */
function OtoMotoParser(response) {
    return __awaiter(this, void 0, void 0, function () {
        var html, $, cars, urls, _i, cars_1, car;
        return __generator(this, function (_a) {
            html = response.data;
            $ = cheerio.load(html);
            cars = $('.offers.list > article').toArray();
            urls = [];
            for (_i = 0, cars_1 = cars; _i < cars_1.length; _i++) {
                car = cars_1[_i];
                urls.push(car.attribs["data-href"]);
            }
            return [2 /*return*/, urls];
        });
    });
}
/**
 * OLX parser
 * @param response
 * @returns URLS (string) array
 */
function OLXParser(response) {
    return __awaiter(this, void 0, void 0, function () {
        var html, $, auctions, urls, _i, auctions_1, offer, url;
        return __generator(this, function (_a) {
            html = response.data;
            $ = cheerio.load(html);
            auctions = $('.marginright5.link.linkWithHash').toArray();
            urls = [];
            for (_i = 0, auctions_1 = auctions; _i < auctions_1.length; _i++) {
                offer = auctions_1[_i];
                url = offer.attribs["href"].split('.html', 1).shift();
                if (!url) {
                    break;
                }
                urls.push(url + '.html');
            }
            return [2 /*return*/, urls];
        });
    });
}
/**
 * Runs Cron Job
 * @param time (number)
 */
function runCronJob(time, bot) {
    var _this = this;
    var job = new cron_1.CronJob(time + " * * * * *", function () { return __awaiter(_this, void 0, void 0, function () {
        var tasks, _a, _b, _i, task, urls;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("---------------------");
                    return [4 /*yield*/, getAllTasks()];
                case 1:
                    tasks = _c.sent();
                    _a = [];
                    for (_b in tasks)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    task = _a[_i];
                    return [4 /*yield*/, getOffersFromService(tasks[task].service, tasks[task].url)];
                case 3:
                    urls = _c.sent();
                    compareTasks(parseInt(task), tasks[task], urls, bot);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    job.start();
}
exports.runCronJob = runCronJob;
/**
 * Checks for Database file, if file does not exist, it creates one
 */
function isDatabaseFile(callback) {
    fs_1.default.stat('./database.json', function (err) {
        if (!err) {
            console.log('Database file found');
            callback(null);
            return;
        }
        ;
        fs_1.default.writeFile('./database.json', '{ "tasks": [] }', 'utf-8', function (err) {
            if (err) {
                console.log('There was an error while trying to create database file.', err);
                callback(err);
                return;
            }
            ;
            console.log('Database file created');
            callback(null);
        });
    });
}
exports.isDatabaseFile = isDatabaseFile;
