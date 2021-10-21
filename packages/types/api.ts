export type EmerisGasPrices = { low: number; average: number; high: number };
export type EmerisDenom = {
  name: string;
  display_name: string;
  logo: string;
  precision: number;
  verified: boolean;
  stakable: boolean;
  ticker: string;
  price_id: string;
  fee_token: boolean;
  gas_price_levels: EmerisGasPrices;
  fetch_price: boolean;
  relayer_denom: boolean;
  minimum_thresh_relayer_balance: number;
};
export type EmerisBech32Config = {
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
export type EmerisNodeInfo = {
  endpoint: string;
  chain_id: string;
  bech32_config: EmerisBech32Config;
};
export type EmerisChain = {
  enabled: boolean;
  chain_name: string;
  logo: string;
  display_name: string;
  primary_channel: Record<string, string>;
  denoms: Array<EmerisDenom>;
  demeris_addresses?: Array<string>;
  genesis_hash: string;
  node_info: EmerisNodeInfo;
  valid_block_thresh: string;
  derivation_path: string;
  supported_wallets: Array<string> | null;
  block_explorer: string;
};
export type EmerisChainResponse = {
  chain: EmerisChain;
};
export type EmerisChainNumber = {
  chain_name: string;
  address: string;
  sequence_number: number;
  account_number: number;
};
export type EmerisNumbers = Array<EmerisChainNumber>;
export type EmerisNumbersResponse = {
  numbers: EmerisNumbers;
};

export type Fee = {
  low: string;
  average: string;
  high: string;
};