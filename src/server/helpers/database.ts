import { IBlockchainData, IBlockchainDataType } from "../index";

//in memory runtime database, sufficient for this example
const DATA: IBlockchainData = {
    users: [],
    wallets: [],
    trades: [],
    blocks: []
}

//inserts data into a given key
export const insert = (item: IBlockchainDataType, data: any): number => {
    return DATA[item].push(data);
}

//retreives data based on the given key
export const select = (item: IBlockchainDataType): any => {
    return DATA[item];
}