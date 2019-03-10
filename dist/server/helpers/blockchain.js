"use strict";
exports.__esModule = true;
var database = require("../helpers/database");
var Block_1 = require("../models/Block");
var Transaction_1 = require("../models/Transaction");
var socket_1 = require("../socket");
var TRANSACTIONS_PER_BLOCK = 5;
var CURRENT_TRANSACTIONS = [];
exports.addTransaction = function (type, data) {
    var transaction = new Transaction_1["default"](type, data);
    CURRENT_TRANSACTIONS.push(transaction);
    if (CURRENT_TRANSACTIONS.length === TRANSACTIONS_PER_BLOCK) {
        var block = new Block_1["default"](CURRENT_TRANSACTIONS.slice());
        database.insert("blocks", block);
        CURRENT_TRANSACTIONS.length = 0;
        socket_1.emit("addNewBlock", block);
    }
    return transaction;
};
exports.constructGenesisBlock = function () {
    var block = new Block_1["default"]([]);
    database.insert("blocks", block);
};
