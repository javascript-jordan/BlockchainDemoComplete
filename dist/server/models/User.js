"use strict";
exports.__esModule = true;
var database = require("../helpers/database");
var Wallet_1 = require("./Wallet");
var BlockchainUser = (function () {
    function BlockchainUser(name, age) {
        this.name = name;
        this.age = age;
        this.timestamp = new Date().getTime();
        this.id = this.calculateUserId();
        var wallet = new Wallet_1["default"](this.id);
        database.insert("wallets", wallet);
    }
    BlockchainUser.prototype.calculateUserId = function () {
        return database.select("users").length + 1;
    };
    return BlockchainUser;
}());
exports["default"] = BlockchainUser;
