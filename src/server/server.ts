import * as express from "express";
import * as bodyParser from "body-parser";
import { Server } from "http";
import { join } from "path";
import { init } from "./socket";
import routes from "./routes";
import { constructGenesisBlock } from "./helpers/blockchain";
import { select } from "./helpers/database";

const PORT: number = process.env.NODE_PORT && parseInt(process.env.NODE_PORT) || 3000;
const SERVER: Server = new Server(express().use(express.static(join(__dirname, "../public"))).use(bodyParser.json()).use("/", routes));

//construct the genesis block
constructGenesisBlock();

//initialize the socket
init(SERVER);

//startup the server on the specified port
SERVER.listen(PORT, () => {
    console.log(`Server startup at ${new Date().toISOString()} on port ${PORT}`);
});