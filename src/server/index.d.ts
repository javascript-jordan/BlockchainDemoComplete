export type IBlockchainDataType = "users" | "wallets" | "blocks" | "trades";

export interface IBlockchainWallet {
    owner: number,
    currency: {
        CAD: number,
        USD: number,
        BTC: number
    }
}

export interface IBlockchainUser {
    name: string,
    age: number,
    timestamp: number,
    id: number
}

export interface IBlockchainTrades {
    sender: {
        id: number,
        currency: string,
        amount: number
    },
    receiver: {
        id: number,
        currency: string,
        amount: number
    }
}

export interface IBlockchainTransaction {
    type: string,
    timestamp: number
}

export interface IBlockchainBlock {
    hash: string,
    header: {
        previousBlockHash: string,
        timestamp: number
    },
    height: number,
    transactions: IBlockchainTransaction[]
}

export interface IBlockchainData {
    users: IBlockchainUser[],
    wallets: IBlockchainWallet[],
    trades: IBlockchainTrades[],
    blocks: IBlockchainBlock[]
}