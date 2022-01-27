import { SwapData } from "../../types/src/EmerisTransactions";
import CosmosAminoMessageMapper from "./cosmos_amino";

export default class OsmosisMessageMapper extends CosmosAminoMessageMapper {
    swap(transaction: SwapData, signing_address: string) {
        let isReverse = false;
        if (transaction.from.denom !== transaction.pool.reserve_coin_denoms[0]) {
            isReverse = true;
        }
        return [{
            type: "osmosis.gamm.v1beta1/MsgSwapExactAmountIn",
            value: {
                swap_requester_address: signing_address,
                pool_id: parseInt(transaction.pool.id),
                swap_type_id: transaction.pool.type_id,
                offer_coin: { amount: transaction.from.amount, denom: transaction.from.denom },
                demand_coin_denom: transaction.to.denom,
                offer_coin_dee: transaction.offerFee,
                order_price: transaction.orderPrice
            }
        }]
    }
}