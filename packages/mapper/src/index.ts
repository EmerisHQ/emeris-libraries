import { EmerisTransactions } from "@emeris/types";
import ChainConfig from "@emeris/chain-config";
import { EmerisMessageMapper } from "./EmerisMessageMapper";

export default async function map(req: EmerisTransactions.AbstractTransactionMappingRequest): Promise<unknown> {
    const chainName = req.chainName;
    const signingAddress = req.signingAddress;
    const chainConfig = new ChainConfig(process.env.EMERIS_ENDPOINT || 'https://api.emeris.com/v1')
    const chainType = await chainConfig.getChainType(chainName);
    try {
        const mapped = await Promise.all(req.txs.map(async (tx: EmerisTransactions.AbstractTransaction) => {
            return (await EmerisMessageMapper.fromChainProtocol(chainType, tx.protocol)).map(tx, signingAddress);
        }));
        return mapped.flat();
    } catch (e) {
        throw (new Error('Could not map txs: ' + e));
    }
}
