import { IBlockchainTrades } from "..";

export default class BlockchainTrade implements IBlockchainTrades {
    
    sender = {
        id: null,
        currency: null,
        amount: null
    }
    receiver = {
        id: null,
        currency: null,
        amount: null
    }

    constructor(data: any){
        (Object as any).assign(this, data);
    }
}