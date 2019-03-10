import * as database from "../helpers/database";
import { IBlockchainTransaction, IBlockchainDataType, IBlockchainUser, IBlockchainWallet } from "..";

const TRANSACTION_MAP: { [key: string]: string } = {
    addUser: "users",
    addWallet: "wallets",
    addTrade: "trades"
}

export default class BlockchainTransaction implements IBlockchainTransaction {

    type: string = null;
    timestamp: number = null;
    data: any = null;
    error: any;

    constructor(action: string, data: any){
        this.type = TRANSACTION_MAP[action];
        this.timestamp = new Date().getTime();
        this.data = data;
        switch(this.type){
            case "users":
                this.addUser();
                break;
            case "trades":
                let trade = this.addTrade();
                //check for error
                this.error = trade;
                break;
            case "wallets":
                this.fundWallet(this.data);
                break;
            default:
                break;
        }
    }

    //adds a new user on the blockchain
    private addUser(): void {
        database.insert("users", this.data);
    }

    //adds a new trade to the blockchain
    private addTrade(): any {
        function getWallet(id: number): IBlockchainWallet{
            return database.select("wallets").find(w => w.owner === id);
        }
        try {
            if(this.data.sender.id === this.data.receiver.id) return {error: "same-user"};
            let sender = getWallet(this.data.sender.id),
                receiver = getWallet(this.data.receiver.id);
            if(!sender.currency[this.data.sender.currency]) return {error: "sender-has-no-currency"};
            if(!receiver.currency[this.data.receiver.currency]) return {error: "receiver-has-no-currency"};
            if(sender.currency[this.data.sender.currency] < this.data.sender.amount) return {error: "sender-not-enough-currency"};
            if(receiver.currency[this.data.receiver.currency] < this.data.receiver.amount) return {error: "receiver-not-enough-currency"};
            //all good
            sender.currency[this.data.sender.currency] -= this.data.sender.amount;
            sender.currency[this.data.receiver.currency] += this.data.receiver.amount;
            receiver.currency[this.data.receiver.currency] -= this.data.receiver.amount;
            receiver.currency[this.data.sender.currency] += this.data.sender.amount;
            //add new transaction
            database.insert("trades", this.data);
        } catch (error) {
            console.error(error);
        }
    }

    //adds funds to a users wallet on the blockchain
    private fundWallet(data): void {
        //get the current users wallet
        let wallet = database.select("wallets").find(wallet => wallet.owner === data.owner);
        //add the new funds
        wallet.currency[data.currency] = wallet.currency[data.currency] + data.amount;
    }
}