import { EmerisDEXInfo } from '.';
import * as Base from './EmerisBase';
import { Static, StaticArray,Type } from "@sinclair/typebox";

export type FeeWDenom = {
  amount: Base.GasPrice;
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
export type CustomData = {
  raw: any;
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
  | CustomData
export type TransactionSignRequest = {
    signingAddress: string,
    chainId: string,
    messages: AbstractTransaction[],
    fee: {
        gas: string,
        amount: Base.Amount[]
    },
    memo: string
};
export const AbstractAmount = Type.Strict(Type.Object({
  denom: Type.String(),
  base_denom: Type.Optional(Type.String()),
  chain_name: Type.Optional(Type.String()),
  amount: Type.String(),
}));

export type AbstractAmount = Static<typeof AbstractAmount>
export type AbstractFee = {
  amount: AbstractAmount;
  gas: number;
}
export const AbstractTransferTransactionData = Type.Strict(Type.Object({
  amount: AbstractAmount,
  fromAddress: Type.String(),
  toAddress: Type.String(),
  chainName: Type.String(),
}));
export type AbstractTransferTransactionData = Static<typeof AbstractTransferTransactionData>
export const AbstractTransferTransaction = Type.Strict(Type.Object({
  type: Type.Literal('transfer'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractTransferTransactionData
}));
export type AbstractTransferTransaction = Static<typeof AbstractTransferTransaction>;

export const AbstractIBCTransferTransactionData = Type.Strict(Type.Object({
  amount: AbstractAmount,
  fromAddress: Type.String(),
  toAddress: Type.String(),
  toChain: Type.String(),
  through: Type.String(),
  chainName: Type.String(),
}));
export type AbstractIBCTransferTransactionData = Static<typeof AbstractIBCTransferTransactionData>

export const AbstractIBCTransferBackwardTransaction = Type.Strict(Type.Object({
  type: Type.Literal('IBCtransferBackward'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractIBCTransferTransactionData
}));
export type AbstractIBCTransferBackwardTransaction = Static<typeof AbstractIBCTransferBackwardTransaction>
export const AbstractIBCTransferForwardTransaction = Type.Strict(Type.Object({
  type: Type.Literal('IBCtransferForward'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractIBCTransferTransactionData
}));
export type AbstractIBCTransferForwardTransaction = Static<typeof AbstractIBCTransferForwardTransaction>
export const AbstractSwapTransactionData = Type.Strict(Type.Object({
  from: AbstractAmount,
  to:  AbstractAmount,
  pool: Type.Record(Type.String(),Type.Unknown()),
  chainName:  Type.String()
}));
export type AbstractSwapTransactionData = Static<typeof AbstractSwapTransactionData>
export const AbstractSwapTransaction = Type.Strict(Type.Object({
  type: Type.Literal('swap'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractSwapTransactionData,
}));
export type AbstractSwapTransaction = Static<typeof AbstractSwapTransactionData>;

export const AbstractCreatePoolTransactionData = Type.Strict(Type.Object({
  coinA: AbstractAmount,
  coinB: AbstractAmount,
  extensions: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  chainName: Type.String(),
}));

export type AbstractCreatePoolTransactionData = Static<typeof AbstractCreatePoolTransactionData>;

export const AbstractCreatePoolTransaction = Type.Strict(Type.Object({
  type: Type.Literal('createPool'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractCreatePoolTransactionData
}));

export type AbstractCreatePoolTransaction = Static<typeof AbstractCreatePoolTransaction>

export const AbstractAddLiquidityTransactionData = Type.Strict(Type.Object({
  coinA: AbstractAmount,
  coinB: AbstractAmount,
  pool: Type.Record(Type.String(), Type.Unknown()),
  chainName: Type.String(),
}));
export type AbstractAddLiquidityTransactionData = Static<typeof AbstractAddLiquidityTransactionData>;

export const AbstractAddLiquidityTransaction = Type.Strict(Type.Object({
  type: Type.Literal('addLiquidity'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractAddLiquidityTransactionData
}));

export type AbstractAddLiquidityTransaction = Static<typeof AbstractAddLiquidityTransaction>;

export const AbstractWithdrawLiquidityTransactionData = Type.Strict(Type.Object({
  poolCoin: AbstractAmount,
  pool: Type.Record(Type.String(), Type.Unknown()),
  chainName: Type.String(),
}));
export type AbstractWithdrawLiquidityTransactionData = Static<typeof AbstractWithdrawLiquidityTransactionData>;

export const AbstractWithdrawLiquidityTransaction = Type.Strict(Type.Object({
  type: Type.Literal('withdrawLiquidity'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractWithdrawLiquidityTransactionData
}));

export type AbstractWithdrawLiquidityTransaction = Static<typeof AbstractWithdrawLiquidityTransaction>;
const Rewards = Type.Strict(Type.Array(Type.Strict(Type.Object({ reward: Type.String(), validator_address: Type.String() }))));
export const AbstractClaimRewardsTransactionData = Type.Strict(Type.Object({
  total: Type.String(),
  rewards: Rewards,
  chainName: Type.String(),
}));
export type AbstractClaimRewardsTransactionData = Static<typeof AbstractClaimRewardsTransactionData>;

export const AbstractClaimRewardsTransaction = Type.Strict(Type.Object({
  type: Type.Literal('claim'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractClaimRewardsTransactionData
}));
export type AbstractClaimRewardsTransaction = Static<typeof AbstractClaimRewardsTransaction>;

export const AbstractStakeTransactionData = Type.Strict(Type.Object({
  validatorAddress: Type.String(),
  amount: AbstractAmount,
  chainName: Type.String(),
}));
export type AbstractStakeTransactionData = Static<typeof AbstractStakeTransactionData>;

export const AbstractStakeTransaction = Type.Strict(Type.Object({
  type: Type.Literal('stake'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: Type.Array(AbstractStakeTransactionData),
}));
export type AbstractStakeTransaction = Static<typeof AbstractStakeTransaction>;

export const AbstractUnstakeTransactionData = Type.Strict(Type.Object({
  validatorAddress: Type.String(),
  amount: AbstractAmount,
  chainName: Type.String(),
}));
export type AbstractUnstakeTransactionData = Static<typeof AbstractUnstakeTransactionData>;

export const AbstractUnstakeTransaction = Type.Strict(Type.Object({
  type: Type.Literal('unstake'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractUnstakeTransactionData,
}));
export type AbstractUnstakeTransaction = Static<typeof AbstractUnstakeTransaction>;

export const AbstractRestakeTransactionData = Type.Strict(Type.Object({
  validatorSrcAddress: Type.String(),
  validatorDstAddress: Type.String(),
  amount: AbstractAmount,
  chainName: Type.String(),
}));
export type AbstractRestakeTransactionData = Static<typeof AbstractRestakeTransactionData>;

export const AbstractRestakeTransaction = Type.Strict(Type.Object({
  type: Type.Literal('switch'),
  protocol: Type.Optional(Type.Enum(EmerisDEXInfo.DEX)),
  data: AbstractRestakeTransactionData,
}));
export type AbstractRestakeTransaction = Static<typeof AbstractRestakeTransaction>;

export const AbstractTransactionData = Type.Union([AbstractTransferTransactionData , AbstractIBCTransferTransactionData , AbstractSwapTransactionData , AbstractCreatePoolTransactionData , AbstractAddLiquidityTransactionData , AbstractWithdrawLiquidityTransactionData , AbstractClaimRewardsTransactionData , AbstractStakeTransactionData , AbstractUnstakeTransactionData , AbstractRestakeTransactionData]);
export type AbstractTransactionData = Static<typeof AbstractTransactionData>;
export const AbstractTransaction = Type.Union([AbstractTransferTransaction, AbstractIBCTransferBackwardTransaction, AbstractIBCTransferForwardTransaction, AbstractSwapTransaction, AbstractCreatePoolTransaction, AbstractAddLiquidityTransaction, AbstractWithdrawLiquidityTransaction, AbstractClaimRewardsTransaction, AbstractStakeTransaction, AbstractUnstakeTransaction, AbstractRestakeTransaction]);
export type AbstractTransaction = Static<typeof AbstractTransaction>;

export const AbstractTransactionMappingRequest = Type.Strict(Type.Object({
  chainName: Type.String(),
  signingAddress: Type.String(),
  txs: Type.Array(AbstractTransaction),
}));
export type AbstractTransactionMappingRequest = Static<typeof AbstractTransactionMappingRequest>;