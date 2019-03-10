import { IBlockchainWallet } from "..";

export default class BlockchainWallet implements IBlockchainWallet {

    owner: number;
    currency: {
        CAD: number,
        USD: number,
        BTC: number
    } = {
        CAD: 0,
        USD: 0,
        BTC: 0
    }
    constructor(owner: number){
        this.owner = owner;
    }

}