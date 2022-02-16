import { EmerisDEXInfo } from '.';
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
    poolId: string;
    protocol: string;
    orderPrice: number;
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
    type: 'ibcTransfer' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool' | 'custom';
    data: TransactionType;
};
export declare type TransactionData = IBCData | SwapData | TransferData | AddLiquidityData | WithdrawLiquidityData | CreatePoolData;
export declare type TransactionSignRequest = {
    signingAddress: string;
    chainId: string;
    messages: Transaction<TransactionData>[];
    fee: {
        gas: string;
        amount: Base.Amount[];
    };
    memo: string;
};
export declare type AbstractAmount = {
    denom: string;
    base_denom?: string;
    amount: string;
};
export declare type AbstractFee = {
    amount: AbstractAmount;
    gas: number;
};
export declare type AbstractTransferTransactionData = {
    amount: AbstractAmount;
    fromAddress: string;
    toAddress: string;
};
export declare type AbstractTransferTransaction = {
    type: 'transfer';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractTransferTransactionData;
};
export declare type AbstractIBCTransferTransactionData = {
    amount: AbstractAmount;
    fromAddress: string;
    toAddress: string;
    toChain: string;
    through: string;
};
export declare type AbstractIBCTransferTransaction = {
    type: 'IBCtransfer';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractIBCTransferTransactionData;
};
export declare type AbstractSwapTransactionData = {
    from: AbstractAmount;
    to: AbstractAmount;
    poolId: string;
};
export declare type AbstractSwapTransaction = {
    type: 'swap';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractSwapTransactionData;
};
export declare type AbstractCreatePoolTransactionData = {
    coinA: AbstractAmount;
    coinB: AbstractAmount;
    extensions?: Record<string, unknown>;
};
export declare type AbstractCreatePoolTransaction = {
    type: 'createPool';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractCreatePoolTransactionData;
};
export declare type AbstractAddLiquidityTransactionData = {
    coinA: AbstractAmount;
    coinB: AbstractAmount;
    poolId: string;
};
export declare type AbstractAddLiquidityTransaction = {
    type: 'addLiquidity';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractAddLiquidityTransactionData;
};
export declare type AbstractWithdrawLiquidityTransactionData = {
    poolCoin: AbstractAmount;
    poolId: string;
};
export declare type AbstractWithdrawLiquidityTransaction = {
    type: 'withdrawLiquidity';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractWithdrawLiquidityTransactionData;
};
export declare type AbstractTransactionData = AbstractTransferTransactionData | AbstractIBCTransferTransactionData | AbstractSwapTransactionData | AbstractCreatePoolTransactionData | AbstractAddLiquidityTransactionData | AbstractWithdrawLiquidityTransactionData;
export declare type AbstractTransaction = AbstractTransferTransaction | AbstractIBCTransferTransaction | AbstractSwapTransaction | AbstractCreatePoolTransaction | AbstractAddLiquidityTransaction | AbstractWithdrawLiquidityTransaction;
export declare type AbstractTransactionMappingRequest = {
    chainName: string;
    signingAddress: string;
    txs: AbstractTransaction[];
};
//# sourceMappingURL=EmerisTransactions.d.ts.map