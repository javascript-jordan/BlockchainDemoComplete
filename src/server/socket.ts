import { Server } from "http";
import * as socketIO from "socket.io";
import { IBlockchainUser, IBlockchainWallet } from ".";

var socket: socketIO.Server;

export const init = (server: Server): any => {
    socket = socketIO(server);
}

export const emit = (event: string, data: any): void => {
    socket.emit(event, data);
}