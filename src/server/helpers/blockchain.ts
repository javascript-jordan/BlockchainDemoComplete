import * as database from "../helpers/database";
import BlockchainBlock from "../models/Block";
import { IBlockchainTransaction } from "..";
import BlockchainTransaction from "../models/Transaction";
import { emit } from "../socket";


const TRANSACTIONS_PER_BLOCK: number = 5; //amount of transactions allowed per block
const CURRENT_TRANSACTIONS: IBlockchainTransaction[] = []; //temp transactions that havent been written

export const addTransaction = (type: string, data: any): BlockchainTransaction => {
    //spawn a new transaction
    let transaction = new BlockchainTransaction(type, data);
    //add our transaction to the transactions array
    CURRENT_TRANSACTIONS.push(transaction);
    //check to see if we need to write a new block
    if(CURRENT_TRANSACTIONS.length === TRANSACTIONS_PER_BLOCK){
        //spawn a new block
        let block = new BlockchainBlock([...CURRENT_TRANSACTIONS]);
        //insert the block into the Database
        database.insert("blocks", block);
        //empty current transaction array
        CURRENT_TRANSACTIONS.length = 0;
        //emit a new block added event
        emit("addNewBlock", block);
    }
    //return the new transaction
    return transaction;
}

//constructs the genesis block containing no transactions
//called on server startup in server.ts
export const constructGenesisBlock = (): void => {
    //new block passing no transactions
    let block = new BlockchainBlock([]);
    //insert into database
    database.insert("blocks", block);
}