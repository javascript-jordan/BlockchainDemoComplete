"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express = require("express");
var blockchain = require("./helpers/blockchain");
var database = require("./helpers/database");
var socket = require("./socket");
var User_1 = require("./models/User");
var ROUTER = express.Router();
ROUTER.post("/users", function (req, res) {
    var user = new User_1["default"](req.body.usersName, req.body.usersAge);
    var tx = blockchain.addTransaction("addUser", user);
    socket.emit("addNewUser", user);
    res.send({ data: "success" });
});
ROUTER.get("/users", function (req, res) {
    return res.send({ data: database.select("users") });
});
ROUTER.post("/wallets", function (req, res) {
    var tx = blockchain.addTransaction("addWallet", req.body);
    socket.emit("addNewWallet", tx.data);
    return res.send({ data: "success" });
});
ROUTER.get("/wallets", function (req, res) {
    return res.send({ data: database.select("wallets") });
});
ROUTER.post("/trades", function (req, res) {
    var tx = blockchain.addTransaction("addTrade", req.body);
    if (tx.error) {
        return res.send(tx.error);
    }
    socket.emit("addNewTrade", { data: __assign({}, tx.data, { timestamp: new Date().getTime() }) });
    return res.send({ data: "success" });
});
ROUTER.get("/trades", function (req, res) {
    res.send({ data: database.select("trades") });
});
ROUTER.get("/blocks", function (req, res) {
    return res.send({ data: database.select("blocks") });
});
exports["default"] = ROUTER;
