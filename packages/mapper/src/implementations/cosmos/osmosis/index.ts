import { EmerisTransactions} from "@emeris/types";
import CosmosAminoMessageMapper from "../index";
import { Pool} from '@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm/module/types/osmosis/gamm/v1beta1/pool';

export default class OsmosisAminoMessageMapper extends CosmosAminoMessageMapper {
	
    swap(transactions: EmerisTransactions.AbstractSwapTransactionData[], signing_address: string) {
        let routes = [];
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const pool = transaction.pool as unknown as Pool;
            routes.push({ poolId: pool.id, tokenOutDenom: transaction.to.denom });
        }
        return {
            type: "osmosis/gamm/swap-exact-amount-in",
            value: {
                sender: signing_address,
                tokenIn: transactions[0].from,
                tokenOutMinAmount: transactions[transactions.length-1].to.amount,
                routes
            }
        }
    }

}