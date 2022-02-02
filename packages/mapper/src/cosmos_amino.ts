import { EmerisTransactions} from "@emeris/types";
import { EmerisMessageMapper } from "./base";
import * as Long from "long";

export default class CosmosAminoMessageMapper extends EmerisMessageMapper {
    transfer(transaction: EmerisTransactions.TransferData, signing_address: string) {
        return [{
            type: "cosmos-sdk/MsgSend",
            value: {
                amount: [transaction.amount],
                to_address: transaction.to_address,
                from_address: signing_address,
            },
        }];
    }

    ibcTransfer(transaction: EmerisTransactions.IBCData, signing_address: string) {
        return [{
            type: "cosmos-sdk/MsgTransfer",
            value: {
                source_port: 'transfer',
                source_channel: transaction.through,
                sender: signing_address,
                receiver: transaction.to_address,
                timeout_timestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
                //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
                token: { ...transaction.amount },
            }
        }]
    }

    swap(transaction: EmerisTransactions.SwapData, signing_address: string) {
        let isReverse = false;
        if (transaction.from.denom !== transaction.pool.reserve_coin_denoms[0]) {
            isReverse = true;
        }
        const price = [transaction.from, transaction.to].sort((a, b) => {
            if (a.denom < b.denom) return -1;
            if (a.denom > b.denom) return 1;
            return 0;
        });
        return [{
            type: "liquidity/MsgSwapWithinBatch",
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

    addliquidity(transaction: EmerisTransactions.AddLiquidityData, signing_address: string) {
        let depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        } else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }

        return [{
            type: 'liquidity/MsgDepositWithinBatch',
            value: {
                depositor_address: signing_address,
                pool_id: transaction.pool.id,
                deposit_coins: depositCoins
            }
        }]

    }

    withdrawliquidity(transaction: EmerisTransactions.WithdrawLiquidityData, signing_address: string) {
        return [{
            type: 'liquidity/MsgWithdrawWithinBatch',
            value: {
                withdrawer_address: signing_address,
                pool_id: transaction.pool.id,
                pool_coin: { ...transaction.poolCoin },
            },
        }]
    }

    createpool(transaction: EmerisTransactions.CreatePoolData, signing_address: string) {
        let depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        } else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }

        return [{
            type: 'liquidity/MsgCreatePool',
            value: {
                pool_creator_address: signing_address,
                pool_type_id: 1,
                deposit_coins: depositCoins,
            },
        }]
    }
}