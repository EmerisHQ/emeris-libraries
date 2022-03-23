export type Amount = {
  denom: string;
  amount: string;
};
export type ChainAmount = Amount & {
  chain_name: string;
};

export type AmountWithMeta = Amount & {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
};
export type IbcInfo = {
  path: string;
  hash: string;
};
export type PrimaryChannel = {
  counterparty: string;
  channel_name: string;
};
export type GasPrice = {
  average: number;
  high: number;
  low: number;
};
export type Denom = {
  display_name: string;
  fee_token: boolean;
  fetch_price: boolean;
  gas_price_levels: GasPrice;
  logo: string;
  minimum_thresh_relayer_balance: number;
  name: string;
  precision: number;
  price_id: string;
  relayer_denom: boolean;
  stakable: boolean;
  ticker: string;
  verified: boolean;
};
export type Bech32Config = {
  main_prefix: string;
  prefix_account: string;
  prefix_validator: string;
  prefix_consensus: string;
  prefix_public: string;
  prefix_operator: string;
  acc_addr: string;
  acc_pub: string;
  val_addr: string;
  val_pub: string;
  cons_addr: string;
  cons_pub: string;
};
export type NodeInfo = {
  endpoint: string;
  chain_id: string;
  bech32_config: Bech32Config;
};

export type Trace = {
  channel: string;
  port: string;
  client_id: string;
  chain_name: string;
  counterparty_name: string;
};

export type SwapEndBlockResponse = {
  exchanged_offer_coin_amount: string;
  remaining_offer_coin_amount: string;
  exchanged_demand_coin_amount: string;
  demand_coin_denom: string;
  offer_coin_denom: string;
};

export type AddLiquidityEndBlockResponse = {
  accepted_coins: string;
  depositor: string;
  pool_coin_amount: string;
  pool_coin_denom: string;
  refunded_coins: string;
  success: string;
};

export type WithdrawLiquidityEndBlockResponse = {
  pool_id: string;
  pool_coin_amount: string;
  pool_coin_denom: string;
  withdraw_coins: string;
  withdraw_fee_coins: string;
  withdrawer: string;
  success: string;
};

export type PriceQuote = {
  dex: string;
  amount: number;
  denom: string;
  numberOfTransactions: number;
  usdAmount: number;
  fee?: { amount: number; denom: string };
};
export enum ChainType {
  cosmos = "cosmos",
  ethereum = "ethereum",
}
export enum ChainLibraries {
  cosmjs = "cosmjs",
  web3 = "web3",
}
