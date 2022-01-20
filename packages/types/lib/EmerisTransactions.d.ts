import * as API from './EmerisAPI';
import * as Base from './EmerisBase';
export declare type FeeWDenom = {
    amount: API.APIGasPrice;
    denom: string;
    chain_name: string;
};
export declare type Pool = {
    display_name?: string;
    /** id of the pool */
    id: string;
    /** id of the pool_type */
    type_id: number;
    /** denoms of reserve coin pair of the pool */
    reserve_coin_denoms: string[];
    /** reserve account address of the pool */
    reserve_account_address: string;
    /** denom of pool coin of the pool */
    pool_coin_denom: string;
};
export declare type IBCData = {
    amount: Base.Amount;
    from_chain: string;
    base_denom?: string;
    to_chain: string;
    to_address?: string;
    through: string;
};
export declare type TransferData = {
    amount: Base.Amount;
    chain_name: string;
    to_address: string;
};
export declare type SwapData = {
    from: Base.Amount;
    to: Base.Amount;
    pool: Pool;
    orderPrice: number;
    offerFee: number;
};
export declare type AddLiquidityData = {
    coinA: Base.Amount;
    coinB: Base.Amount;
    pool: Pool;
};
export declare type CreatePoolData = {
    coinA: Base.Amount;
    coinB: Base.Amount;
};
export declare type WithdrawLiquidityData = {
    poolCoin: Base.Amount;
    pool: Pool;
};
export declare type Transaction<TransactionType> = {
    type: 'ibcTransfer' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
    chainId: string;
    protocol: string;
    data: TransactionType;
};
export declare type TransactionData = IBCData | SwapData | TransferData | AddLiquidityData | WithdrawLiquidityData | CreatePoolData;
export declare type TransactionSignRequest = {
    signingAddress: string;
    chainTxData: any;
    transaction: Transaction<TransactionData>;
};
//# sourceMappingURL=EmerisTransactions.d.ts.map