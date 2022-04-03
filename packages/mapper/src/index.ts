import ChainConfig from "@emeris/chain-config";
import { EmerisDEXInfo, EmerisTransactions } from "@emeris/types";
import cosmos from './implementations/cosmos';
import cosmosgravity from './implementations/cosmos/gravity';
import cosmososmosis from './implementations/cosmos/osmosis';

 async function MapperFromChainProtocol(chainName:string, protocol?:EmerisDEXInfo.DEX) {
    switch (chainName) {
        case 'cosmos':
            switch (protocol) {
                case 'gravity':
                    return new cosmosgravity(chainName);
                case 'osmosis':
                    return new cosmososmosis(chainName);
                default:
                    return new cosmos(chainName);
            }
        default:
            return new cosmos(chainName);            
    }
}
export default async function map(req: EmerisTransactions.AbstractTransactionMappingRequest): Promise<unknown> {
    const chainName = req.chainName;
    const signingAddress = req.signingAddress;
    const chainConfig = new ChainConfig(process.env.EMERIS_ENDPOINT || 'https://api.emeris.com/v1')
    const chainType = await chainConfig.getChainType(chainName);
    try {
        const mapped = await Promise.all(req.txs.map(async (tx: EmerisTransactions.AbstractTransaction) => {
            return (await MapperFromChainProtocol(chainType, tx.protocol)).map(tx, signingAddress);
        }));
        return mapped.flat();
    } catch (e) {
        throw (new Error('Could not map txs: ' + e));
    }
}
