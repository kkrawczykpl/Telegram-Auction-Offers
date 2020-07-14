"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceFromUrl = exports.getUrlFromMessage = void 0;
var service_response_1 = require("../classes/service.response");
var strings_1 = require("./strings");
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
 * Gets service from URL
 * @param message (string)
 * @returns ServiceResponse
 */
function getServiceFromUrl(message) {
    // RegExp pattern: https:// + one of < (www.)otomoto.pl || (www.)olx.pl || (www.)allegro.pl> + /any_word (because we want link to somewhere, not the home page)
    var services = message.match(/(https:\/\/)(www.otomoto.pl|otomoto.pl|olx.pl|www.olx.pl|m.olx.pl|www.m.olx.pl|allegro.pl|www.allegro.pl)\/\w+/g);
    // Bad format - no service provided
    if (!services) {
        return new service_response_1.ServiceResponse()
            .setSuccess(false)
            .setMessage(strings_1.strings.incorrect_url);
    }
    // More than 1 URL provided
    else if (services.length > 1) {
        return new service_response_1.ServiceResponse()
            .setSuccess(false)
            .setMessage(strings_1.strings.mulitple_url);
    }
    // Check the service to which the link is provided
    var serviceName = "";
    if (services[0].includes('olx.pl')) {
        serviceName = "OLX";
    }
    else if (services[0].includes('otomoto.pl')) {
        serviceName = "OtoMoto";
    }
    else if (services[0].includes('allegro.pl')) {
        serviceName = "Allegro";
    }
    else {
        return new service_response_1.ServiceResponse()
            .setSuccess(false)
            .setMessage(strings_1.strings.incorrect_url);
    }
    return new service_response_1.ServiceResponse()
        .setSuccess(true)
        .setName(serviceName);
}
exports.getServiceFromUrl = getServiceFromUrl;
