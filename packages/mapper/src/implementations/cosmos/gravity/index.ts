import { EmerisTransactions} from "@emeris/types";
import CosmosAminoMessageMapper from "../index";
import { BigNumber } from "bignumber.js";
import { Pool } from '@clockwork-projects/cosmos-gaia-js/gravity-devs/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/liquidity';

export default class GravityAminoMessageMapper extends CosmosAminoMessageMapper {
	
    swap(transaction: EmerisTransactions.AbstractSwapTransactionData, signing_address: string) {
        const pool = transaction.pool as unknown as Pool;
        const offerCoinFee = (new BigNumber(transaction.from.amount)).multipliedBy(0.0015)
        BigNumber.set({ DECIMAL_PLACES: 0 });
        const price = [transaction.from, transaction.to].sort((a, b) => {
            if (a.denom < b.denom) return -1;
            if (a.denom > b.denom) return 1;
            return 0;
        });
        return {
            type: "liquidity/MsgSwapWithinBatch",
            value: {
                swap_requester_address: signing_address,
                pool_id: pool.id,
                swap_type_id: pool.typeId,
                offer_coin: transaction.from,
                demand_coin_denom: transaction.to.denom,
                offer_coin_fee: {amount: offerCoinFee.toString(), denom: transaction.from.denom },
                order_price: (new BigNumber(price[0].amount)).dividedBy( new BigNumber(price[1].amount)).toString()
            }
        }
    }

    addLiquidity(transaction: EmerisTransactions.AbstractAddLiquidityTransactionData, signing_address: string) {
        let depositCoins;
        const pool = transaction.pool as unknown as Pool;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        } else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }

        return {
            type: 'liquidity/MsgDepositWithinBatch',
            value: {
                depositor_address: signing_address,
                pool_id: pool.id,
                deposit_coins: depositCoins
            }
        }
    }

    withdrawLiquidity(transaction: EmerisTransactions.AbstractWithdrawLiquidityTransactionData, signing_address: string) {
        const pool = transaction.pool as unknown as Pool;
        return {
            type: 'liquidity/MsgWithdrawWithinBatch',
            value: {
                withdrawer_address: signing_address,
                pool_id: pool.id,
                pool_coin: { ...transaction.poolCoin },
            },
        }
    }

    createPool(transaction: EmerisTransactions.AbstractCreatePoolTransactionData, signing_address: string) {
        let depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        } else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }

        return {
            type: 'liquidity/MsgCreatePool',
            value: {
                pool_creator_address: signing_address,
                pool_type_id: 1,
                deposit_coins: depositCoins,
            },
        }
    }
}