"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var http_1 = require("http");
var path_1 = require("path");
var socket_1 = require("./socket");
var routes_1 = require("./routes");
var blockchain_1 = require("./helpers/blockchain");
var PORT = process.env.NODE_PORT && parseInt(process.env.NODE_PORT) || 3000;
var SERVER = new http_1.Server(express().use(express.static(path_1.join(__dirname, "../public"))).use(bodyParser.json()).use("/", routes_1["default"]));
blockchain_1.constructGenesisBlock();
socket_1.init(SERVER);
SERVER.listen(PORT, function () {
    console.log("Server startup at " + new Date().toISOString() + " on port " + PORT);
});
