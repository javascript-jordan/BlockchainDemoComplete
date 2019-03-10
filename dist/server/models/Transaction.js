"use strict";
exports.__esModule = true;
var database = require("../helpers/database");
var TRANSACTION_MAP = {
    addUser: "users",
    addWallet: "wallets",
    addTrade: "trades"
};
var BlockchainTransaction = (function () {
    function BlockchainTransaction(action, data) {
        this.type = null;
        this.timestamp = null;
        this.data = null;
        this.type = TRANSACTION_MAP[action];
        this.timestamp = new Date().getTime();
        this.data = data;
        switch (this.type) {
            case "users":
                this.addUser();
                break;
            case "trades":
                var trade = this.addTrade();
                this.error = trade;
                break;
            case "wallets":
                this.fundWallet(this.data);
                break;
            default:
                break;
        }
    }
    BlockchainTransaction.prototype.addUser = function () {
        database.insert("users", this.data);
    };
    BlockchainTransaction.prototype.addTrade = function () {
        function getWallet(id) {
            return database.select("wallets").find(function (w) { return w.owner === id; });
        }
        try {
            if (this.data.sender.id === this.data.receiver.id)
                return { error: "same-user" };
            var sender = getWallet(this.data.sender.id), receiver = getWallet(this.data.receiver.id);
            if (!sender.currency[this.data.sender.currency])
                return { error: "sender-has-no-currency" };
            if (!receiver.currency[this.data.receiver.currency])
                return { error: "receiver-has-no-currency" };
            if (sender.currency[this.data.sender.currency] < this.data.sender.amount)
                return { error: "sender-not-enough-currency" };
            if (receiver.currency[this.data.receiver.currency] < this.data.receiver.amount)
                return { error: "receiver-not-enough-currency" };
            sender.currency[this.data.sender.currency] -= this.data.sender.amount;
            sender.currency[this.data.receiver.currency] += this.data.receiver.amount;
            receiver.currency[this.data.receiver.currency] -= this.data.receiver.amount;
            receiver.currency[this.data.sender.currency] += this.data.sender.amount;
            database.insert("trades", this.data);
        }
        catch (error) {
            console.error(error);
        }
    };
    BlockchainTransaction.prototype.fundWallet = function (data) {
        var wallet = database.select("wallets").find(function (wallet) { return wallet.owner === data.owner; });
        wallet.currency[data.currency] = wallet.currency[data.currency] + data.amount;
    };
    return BlockchainTransaction;
}());
exports["default"] = BlockchainTransaction;
