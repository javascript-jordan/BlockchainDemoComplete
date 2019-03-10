"use strict";
exports.__esModule = true;
var BlockchainWallet = (function () {
    function BlockchainWallet(owner) {
        this.currency = {
            CAD: 0,
            USD: 0,
            BTC: 0
        };
        this.owner = owner;
    }
    return BlockchainWallet;
}());
exports["default"] = BlockchainWallet;
