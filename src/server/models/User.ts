import * as database from "../helpers/database";
import { IBlockchainUser, IBlockchainWallet } from "..";
import BlockchainWallet from "./Wallet";

export default class BlockchainUser implements IBlockchainUser {

    name: string;
    age: number;
    timestamp: number;
    id: number;
    wallet: IBlockchainWallet;

    constructor(name: string, age: number){
        this.name = name;
        this.age = age;
        this.timestamp = new Date().getTime();
        this.id = this.calculateUserId();
        //create a new wallet
        let wallet  = new BlockchainWallet(this.id);
        //add it to the database
        database.insert("wallets", wallet);
    }

    private calculateUserId(): number {
        return database.select("users").length + 1;
    }
}