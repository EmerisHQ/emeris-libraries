import { EmerisTransactions} from "@emeris/types";
import CosmosAminoMessageMapper from "../index";
import { Pool} from '@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm/module/types/osmosis/gamm/v1beta1/pool';

export default class OsmosisAminoMessageMapper extends CosmosAminoMessageMapper {
	
    swap(transaction: EmerisTransactions.AbstractSwapTransactionData, signing_address: string) {
        const pool = transaction.pool as unknown as Pool;
        return {
            type: "osmosis/gamm/swap-exact-amount-in",
            value: {
                sender: signing_address,
                tokenIn: transaction.from,
                tokenOutMinAmount: transaction.to.amount,
                routes: [{ poolId: pool.id, tokenOutDenom: transaction.to.denom}]
            }
        }
    }

}