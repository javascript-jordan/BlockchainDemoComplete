"use strict";
exports.__esModule = true;
var database = require("../helpers/database");
var crypto_1 = require("../helpers/crypto");
var BlockchainBlock = (function () {
    function BlockchainBlock(transactions) {
        this.header = {};
        this.transactions = [];
        this.height = null;
        this.header.previousBlockHash = this.calculatePreviousBlockHash();
        this.header.timestamp = new Date().getTime();
        this.height = this.calculateBlockHeight();
        this.transactions = transactions;
        this.hash = this.createHashFromBlockData(this.height, this.header.timestamp, this.header.previousBlockHash, this.transactions);
    }
    BlockchainBlock.prototype.createHashFromBlockData = function (height, timestamp, previousBlockHash, transactions) {
        return crypto_1.hash("" + height + timestamp + previousBlockHash + JSON.stringify(transactions));
    };
    BlockchainBlock.prototype.calculateBlockHeight = function () {
        return database.select("blocks").length;
    };
    BlockchainBlock.prototype.calculatePreviousBlockHash = function () {
        try {
            var blocks = database.select("blocks"), block = JSON.parse(JSON.stringify(blocks.sort(function (a, b) { return a.height < b.height ? -1 : 1; })[blocks.length - 1]));
            return this.createHashFromBlockData(block.height, block.header.timestamp, block.header.previousBlockHash, block.transactions);
        }
        catch (error) {
            return null;
        }
    };
    return BlockchainBlock;
}());
exports["default"] = BlockchainBlock;
