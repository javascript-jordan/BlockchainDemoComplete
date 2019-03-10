"use strict";
exports.__esModule = true;
var BlockchainTrade = (function () {
    function BlockchainTrade(data) {
        this.sender = {
            id: null,
            currency: null,
            amount: null
        };
        this.receiver = {
            id: null,
            currency: null,
            amount: null
        };
        Object.assign(this, data);
    }
    return BlockchainTrade;
}());
exports["default"] = BlockchainTrade;
