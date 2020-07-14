"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceResponse = void 0;
var ServiceResponse = /** @class */ (function () {
    function ServiceResponse() {
    }
    ServiceResponse.prototype.setSuccess = function (success) {
        this.success = success;
        return this;
    };
    ServiceResponse.prototype.setMessage = function (message) {
        this.message = message;
        return this;
    };
    ServiceResponse.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    Object.defineProperty(ServiceResponse.prototype, "successResult", {
        get: function () {
            return this.success;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServiceResponse.prototype, "messageResult", {
        get: function () {
            return this.message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ServiceResponse.prototype, "nameResult", {
        get: function () {
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    return ServiceResponse;
}());
exports.ServiceResponse = ServiceResponse;
