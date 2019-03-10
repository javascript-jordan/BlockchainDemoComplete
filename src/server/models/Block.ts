import * as database from "../helpers/database";
import { IBlockchainBlock, IBlockchainTransaction } from "..";
import { hash } from "../helpers/crypto";

export default class BlockchainBlock implements IBlockchainBlock {

    //header containing previous blocks hash and a timestamp of creation date
    header: { previousBlockHash: string, timestamp: number } = {} as any;
    //a list of transactions that will be stored on the block
    transactions: IBlockchainTransaction[] = [];
    //the current height of the blockchain
    height: number = null;
    //the current blocks hash
    hash: string;

    constructor(transactions: IBlockchainTransaction[]){
        //initialize the previous block hash by calculation with local method
        this.header.previousBlockHash = this.calculatePreviousBlockHash();
        //create a new timestamp based on current date
        this.header.timestamp = new Date().getTime();
        //calculate current height with local method
        this.height = this.calculateBlockHeight();
        //initialize the transactions list with the one passed in by the caller
        this.transactions = transactions;
        //get the hash of the current blocks data with local method
        this.hash = this.createHashFromBlockData(this.height, this.header.timestamp, this.header.previousBlockHash, this.transactions);
    }

    private createHashFromBlockData(height: number, timestamp: number, previousBlockHash: string, transactions: any[]): string {
        //combine the block height, timestamp, previous block hash and the transactions to calculate the hash of the block
        return hash(`${height}${timestamp}${previousBlockHash}${JSON.stringify(transactions)}`);
    }

    private calculateBlockHeight(): number {
        //checks the amount of current blocks in database and returns that as a number
        return database.select("blocks").length;
    }

    private calculatePreviousBlockHash(): string {
        try {
            //first get a list of blocks from database
            let blocks: IBlockchainBlock[] = database.select("blocks"),
                //find the block that was appended last
                block: IBlockchainBlock = JSON.parse(JSON.stringify(blocks.sort((a: any, b: any) => a.height < b.height ? -1 : 1)[blocks.length - 1]));
            //return the hash of the last blocks data
            return this.createHashFromBlockData(block.height, block.header.timestamp, block.header.previousBlockHash, block.transactions);
        } catch (error) {
            //if their was an error parsing data, return null
            return null;
        }
    }
}