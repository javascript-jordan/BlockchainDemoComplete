"use strict";
exports.__esModule = true;
var DATA = {
    users: [],
    wallets: [],
    trades: [],
    blocks: []
};
exports.insert = function (item, data) {
    return DATA[item].push(data);
};
exports.select = function (item) {
    return DATA[item];
};
