"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const Long = __importStar(require("long"));
class CosmosAminoMessageMapper extends base_1.EmerisMessageMapper {
    transfer(transaction, signing_address) {
        return [{
                type: "cosmos-sdk/MsgSend",
                value: {
                    amount: [transaction.amount],
                    to_address: transaction.to_address,
                    from_address: signing_address,
                },
            }];
    }
    ibcTransfer(transaction, signing_address) {
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
            }];
    }
    swap(transaction, signing_address) {
        let isReverse = false;
        if (transaction.from.denom !== transaction.pool.reserve_coin_denoms[0]) {
            isReverse = true;
        }
        const price = [transaction.from, transaction.to].sort((a, b) => {
            if (a.denom < b.denom)
                return -1;
            if (a.denom > b.denom)
                return 1;
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
            }];
    }
    addliquidity(transaction, signing_address) {
        let depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        }
        else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }
        return [{
                type: 'liquidity/MsgDepositWithinBatch',
                value: {
                    depositor_address: signing_address,
                    pool_id: transaction.pool.id,
                    deposit_coins: depositCoins
                }
            }];
    }
    withdrawliquidity(transaction, signing_address) {
        return [{
                type: 'liquidity/MsgWithdrawWithinBatch',
                value: {
                    withdrawer_address: signing_address,
                    pool_id: transaction.pool.id,
                    pool_coin: { ...transaction.poolCoin },
                },
            }];
    }
    createpool(transaction, signing_address) {
        let depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        }
        else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }
        return [{
                type: 'liquidity/MsgCreatePool',
                value: {
                    pool_creator_address: signing_address,
                    pool_type_id: 1,
                    deposit_coins: depositCoins,
                },
            }];
    }
}
exports.default = CosmosAminoMessageMapper;
