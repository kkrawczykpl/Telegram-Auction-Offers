"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseFile = exports.saveTaskToDatabase = exports.getServiceFromUrl = exports.getUrlFromMessage = void 0;
var fs_1 = __importDefault(require("fs"));
/**
 * Gets URL from message
 * @param message (string)
 * @returns URL (string)
 */
function getUrlFromMessage(message) {
    message = message.replace('/dodaj', '').trim();
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
    var services = message.match(/(https:\/\/)(www.otomoto.pl|otomoto.pl|olx.pl|www.olx.pl|allegro.pl|www.allegro.pl)\/\w+/g);
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
 * Saves Task to database
 * @param task (Task)
 * @param callback (function (err) )
 */
function saveTaskToDatabase(task, callback) {
    // Read database.json file
    fs_1.default.readFile('./database.json', 'utf-8', function (err, data) {
        if (err) {
            console.log('There was an error while trying to read database file', err);
            callback(err);
        }
        // Append current Task to database
        var database = JSON.parse(data);
        database.tasks.push(task);
        database = JSON.stringify(database);
        // Save database.json file
        fs_1.default.writeFile('./database.json', database, 'utf-8', function (err) {
            if (err) {
                console.log('There was an error while trying to save database file', err);
                callback(err);
            }
            callback(null);
        });
    });
}
exports.saveTaskToDatabase = saveTaskToDatabase;
/**
 * Checks for Database file, if file does not exist, it creates one
 */
function isDatabaseFile() {
    fs_1.default.stat('./database.json', function (err) {
        if (!err) {
            console.log('Database file found');
            return;
        }
        ;
        fs_1.default.writeFile('./database.json', '{ "tasks": [] }', 'utf-8', function (err) {
            if (err) {
                console.log('There was an error while trying to create database file.', err);
                process.exit(0);
            }
            ;
            console.log('Database file created');
        });
    });
}
exports.isDatabaseFile = isDatabaseFile;
