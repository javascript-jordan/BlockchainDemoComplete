"use strict";
exports.__esModule = true;
var crypto_js_1 = require("crypto-js");
exports.hash = function (phrase) {
    return crypto_js_1.SHA256(phrase).toString();
};
