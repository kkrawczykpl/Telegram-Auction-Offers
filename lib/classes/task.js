"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var Task = /** @class */ (function () {
    function Task() {
    }
    Task.prototype.setChatId = function (chatId) {
        this.chatId = chatId;
        return this;
    };
    Task.prototype.setService = function (service) {
        this.service = service;
        return this;
    };
    Task.prototype.setUrl = function (url) {
        this.url = url;
        return this;
    };
    Task.prototype.setAuctions = function (auctions) {
        this.auctions = auctions;
        return this;
    };
    return Task;
}());
exports.Task = Task;
