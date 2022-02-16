import { EmerisTransactions } from "@emeris/types";
import { EmerisMessageMapper } from "./EmerisMessageMapper";

export default async function map(req: EmerisTransactions.AbstractTransactionMappingRequest):Promise<unknown> {
    const chainName = req.chainName;
    const signingAddress = req.signingAddress;
    try {
        const mapped = Promise.all(req.txs.map(async (tx) => {
            (await EmerisMessageMapper.fromChainProtocol(chainName, tx.protocol)).map(tx, signingAddress);
        }));
        return mapped;
    } catch (e) {
        throw (new Error('Could not map txs: ' + e));
    }
}