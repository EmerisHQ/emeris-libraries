import { EmerisDEXInfo } from '.';
import * as Base from './EmerisBase';

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
  chain_name?: string;
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
  chainName: string;
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
  toChain: string;
  through: string;
  chainName: string;
}
export type AbstractIBCTransferBackwardTransaction = {
  type: 'IBCtransferBackward';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractIBCTransferTransactionData;
}
export type AbstractIBCTransferForwardTransaction = {
  type: 'IBCtransferForward';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractIBCTransferTransactionData;
}
export type AbstractSwapTransactionData = {
  from: AbstractAmount;
  to: AbstractAmount;
  pool: Record<string, unknown>;
  chainName: string;
}
export type AbstractSwapTransaction = {
  type: 'swap';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractSwapTransactionData;
}
export type AbstractCreatePoolTransactionData = {
  coinA: AbstractAmount;
  coinB: AbstractAmount;
  extensions?: Record<string, unknown>
  chainName: string;
}
export type AbstractCreatePoolTransaction = {
  type: 'createPool';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractCreatePoolTransactionData;
}
export type AbstractAddLiquidityTransactionData = {
  coinA: AbstractAmount;
  coinB: AbstractAmount;
  pool: Record<string, unknown>;
  chainName: string;
}
export type AbstractAddLiquidityTransaction = {
  type: 'addLiquidity';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractAddLiquidityTransactionData;
}
export type AbstractWithdrawLiquidityTransactionData = {
  poolCoin: AbstractAmount
  pool: Record<string, unknown>;
  chainName: string;
}
export type AbstractWithdrawLiquidityTransaction = {
  type: 'withdrawLiquidity';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractWithdrawLiquidityTransactionData;
}
export type AbstractClaimRewardsTransactionData = {
  total: string;
  rewards: { reward: string; validator_address: string }[];
  chainName: string;
}
export type AbstractClaimRewardsTransaction = {
  type: 'claim';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractClaimRewardsTransactionData;
}

export type AbstractStakeTransactionData = {
  validatorAddress: string;
  amount: AbstractAmount;
  chainName: string;
};

export type AbstractStakeTransaction = {
  type: 'stake';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractStakeTransactionData[];
}
export type AbstractUnstakeTransactionData = {
  validatorAddress: string;
  amount: AbstractAmount;
  chainName: string;
};
export type AbstractUnstakeTransaction = {
  type: 'unstake';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractUnstakeTransactionData;
}

export type AbstractRestakeTransactionData = {
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: AbstractAmount;
  chainName: string;
};
export type AbstractRestakeTransaction = {
  type: 'switch';
  protocol?: EmerisDEXInfo.DEX;
  data: AbstractRestakeTransactionData;
};
export type AbstractTransactionData = AbstractTransferTransactionData | AbstractIBCTransferTransactionData | AbstractSwapTransactionData | AbstractCreatePoolTransactionData | AbstractAddLiquidityTransactionData | AbstractWithdrawLiquidityTransactionData | AbstractClaimRewardsTransactionData | AbstractStakeTransactionData | AbstractUnstakeTransactionData | AbstractRestakeTransactionData;
export type AbstractTransaction = AbstractTransferTransaction | AbstractIBCTransferBackwardTransaction | AbstractIBCTransferForwardTransaction | AbstractSwapTransaction | AbstractCreatePoolTransaction | AbstractAddLiquidityTransaction | AbstractWithdrawLiquidityTransaction | AbstractClaimRewardsTransaction | AbstractStakeTransaction | AbstractUnstakeTransaction | AbstractRestakeTransaction;

export type AbstractTransactionMappingRequest = {
  chainName: string;
  signingAddress: string;
  txs: AbstractTransaction[];
}