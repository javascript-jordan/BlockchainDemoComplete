"use strict";
exports.__esModule = true;
var socketIO = require("socket.io");
var socket;
exports.init = function (server) {
    socket = socketIO(server);
};
exports.emit = function (event, data) {
    socket.emit(event, data);
};
