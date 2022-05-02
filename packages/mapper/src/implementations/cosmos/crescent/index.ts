import { EmerisTransactions} from "@emeris/types";
import CosmosAminoMessageMapper from "../index";
import { BigNumber } from "bignumber.js";
import { Pair } from '@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.liquidity.v1beta1/module/types/crescent/liquidity/v1beta1/liquidity';
import { OrderDirection } from "@clockwork-projects/crescent-network-crescent-js/crescent-network/crescent/crescent.liquidity.v1beta1/module/types/crescent/liquidity/v1beta1/liquidity";

export default class CrescentAminoMessageMapper extends CosmosAminoMessageMapper {
	
    swap(transaction: EmerisTransactions.AbstractSwapTransactionData, signing_address: string) {
			const pool = transaction.pool as unknown as Pair;
			let direction = OrderDirection.ORDER_DIRECTION_UNSPECIFIED;
			let price;
			let amount;
				if ( transaction.to.denom == pool.quoteCoinDenom || transaction.to.denom == pool.quoteCoinDenom) {
					direction = OrderDirection.ORDER_DIRECTION_BUY;
					price = (new BigNumber(transaction.from.amount)).dividedBy(new BigNumber(transaction.to.amount)).toString();
					amount = transaction.from.amount;
				} else {
					direction = OrderDirection.ORDER_DIRECTION_SELL;
					price = (new BigNumber(transaction.to.amount)).dividedBy(new BigNumber(transaction.from.amount)).toString();
					amount = transaction.to.amount;
				}
				
        return {
            type: "liquidity/MsgLimitOrder",
            value: {
                orderer: signing_address,
                pair_id: String(pool.id),
                direction: direction,
                offer_coin: transaction.from,
								demand_coin_denom: transaction.to.denom,								
							  price,
								amount,
        				order_lifespan: '0',
            }
        }
    }

}