import { EmerisDEXInfo } from '.';
import * as API from './EmerisAPI';
import * as Base from './EmerisBase';
import { BaseFee } from './EmerisFees';

export type FeeWDenom = {
    amount: API.APIGasPrice;
    denom: string;
    chain_name: string;
};
// HACK! Below needs fixing in starport codegen
export type Pool = {
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

export type IBCData = {
    amount: Base.Amount;
    from_chain: string;
    base_denom?: string;
    to_chain: string;
    to_address?: string;
    through: string;
};
export type TransferData = {
    amount: Base.Amount;
    chain_name: string;
    to_address: string;
};
export type SwapData = {
    from: Base.Amount;
    to: Base.Amount;
    poolId: string;
    protocol: string;
    orderPrice: number;
};
export type AddLiquidityData = {
    coinA: Base.Amount;
    coinB: Base.Amount;
    pool: Pool;
};
export type CreatePoolData = {
    coinA: Base.Amount;
    coinB: Base.Amount;
};
export type WithdrawLiquidityData = {
    poolCoin: Base.Amount;
    pool: Pool;
};
export type Transaction<TransactionType> = {
    type: 'ibcTransfer' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool' | 'custom';
    data: TransactionType
};
export type TransactionData =
    | IBCData
    | SwapData
    | TransferData
    | AddLiquidityData
    | WithdrawLiquidityData
    | CreatePoolData
export type TransactionSignRequest = {
    signingAddress: string,
    chainId: string,
    messages: Transaction<TransactionData>[],
    fee: {
        gas: string,
        amount: Base.Amount[]
    },
    memo: string
};
export type AbstractAmount = {
    denom: string;
    base_denom?: string;
    amount: string;
}
export type AbstractFee = {
    amount: AbstractAmount;
    gas: number;
}
export type AbstractTransferTransactionData = {
    amount: AbstractAmount;
    fromAddress: string;
    toAddress: string;
}
export type AbstractTransferTransaction = {
    type: 'transfer';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractTransferTransactionData;
}
export type AbstractIBCTransferTransactionData = {
    amount: AbstractAmount;
    fromAddress: string;
    toAddress: string;
    toChain:string;
    through: string;
}
export type AbstractIBCTransferTransaction = {
    type: 'IBCtransfer';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractIBCTransferTransactionData;
}
export type AbstractSwapTransactionData = {    
    from: AbstractAmount;
    to: AbstractAmount;
    pool: Record<string,unknown>;
}
export type AbstractSwapTransaction = {
    type: 'swap';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractSwapTransactionData;
}
export type AbstractCreatePoolTransactionData = {
    coinA: AbstractAmount;
    coinB: AbstractAmount;
    extensions?: Record<string,unknown>
}
export type AbstractCreatePoolTransaction = {
    type: 'createPool';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractCreatePoolTransactionData;
}
export type AbstractAddLiquidityTransactionData = {
    coinA: AbstractAmount;
    coinB: AbstractAmount;
    pool: Record<string,unknown>;
}
export type AbstractAddLiquidityTransaction = {
    type: 'addLiquidity';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractAddLiquidityTransactionData;
}
export type AbstractWithdrawLiquidityTransactionData = {
    poolCoin: AbstractAmount
    pool: Record<string,unknown>;
}
export type AbstractWithdrawLiquidityTransaction = {
    type: 'withdrawLiquidity';
    protocol?: EmerisDEXInfo.DEX;
    data: AbstractWithdrawLiquidityTransactionData;
}
export type AbstractTransactionData = AbstractTransferTransactionData | AbstractIBCTransferTransactionData | AbstractSwapTransactionData | AbstractCreatePoolTransactionData | AbstractAddLiquidityTransactionData | AbstractWithdrawLiquidityTransactionData;
export type AbstractTransaction = AbstractTransferTransaction | AbstractIBCTransferTransaction | AbstractSwapTransaction | AbstractCreatePoolTransaction | AbstractAddLiquidityTransaction | AbstractWithdrawLiquidityTransaction;

export type AbstractTransactionMappingRequest = {
    chainName: string;
    signingAddress: string;
    txs: AbstractTransaction[];
}