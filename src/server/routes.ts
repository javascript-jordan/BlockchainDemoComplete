import * as express from "express";
import * as blockchain from "./helpers/blockchain";
import * as database from "./helpers/database";
import * as socket from "./socket";
import { Router } from "express-serve-static-core";
import BlockchainUser from "./models/User";
import { log } from "util";
import BlockchainTransaction from "./models/Transaction";

const ROUTER: Router = express.Router();

//request for adding a user
ROUTER.post("/users", (req: express.Request, res: express.Response) => {
    //spawn a new user from model
    let user = new BlockchainUser(req.body.usersName, req.body.usersAge);
    //create a new transaction
    let tx = blockchain.addTransaction("addUser", user);
    //broadcast a new user added event to all clients
    socket.emit("addNewUser", user);
    //send a success back
    res.send({data: "success"});
});

//request for getting users
ROUTER.get("/users", (req: express.Request, res: express.Response) => {
    //send back the list of users on the blockchain
    return res.send({data: database.select("users")});
});

//request for adding funds to wallet
ROUTER.post("/wallets", (req: express.Request, res: express.Response) => {
    //call function to create a new transaction
    let tx = blockchain.addTransaction("addWallet", req.body);
    //broadcast the newly added wallet
    socket.emit("addNewWallet", tx.data);
    //send a success callback
    return res.send({data: "success"});
});

//request for getting a list of wallets
ROUTER.get("/wallets", (req: express.Request, res: express.Response) => {
    return res.send({data: database.select("wallets")});
});

//request for adding a trade
ROUTER.post("/trades", (req: express.Request, res: express.Response) => {
    //spawn a new transaction
    let tx = blockchain.addTransaction("addTrade", req.body);
    //check for an error
    if(tx.error){
        return res.send(tx.error);
    }
    //emit a new trade event
    socket.emit("addNewTrade", {data: {...tx.data, timestamp: new Date().getTime()}});
    //send back a success
    return res.send({data: "success"});
});

//request for getting a list of trades
ROUTER.get("/trades", (req: express.Request, res: express.Response) => {
    res.send({data: database.select("trades")});
});

//request for getting a list of blocks
ROUTER.get("/blocks", (req: express.Request, res: express.Response) => {
    return res.send({data: database.select("blocks")});
});

export default ROUTER;