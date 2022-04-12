import {
  Amount,
  Denom,
  IbcInfo,
  NodeInfo,
  PrimaryChannel,
  Trace,
} from "./EmerisBase";

/* Request Types */

// Chain-based request

export type ChainReq = {
  chain_name: string;
};

// Address-based request

export type AddrReq = {
  address: string;
};

// Chain and Address - based request

export type ChainAddrReq = ChainReq & AddrReq;

// Chain and Counterparty request

export type ChainCounterPartyReq = ChainReq & {
  destination_chain_name: string;
};

// Chain and Counterparty Tx request

export type DestinationTXReq = ChainCounterPartyReq & {
  tx_hash: string;
};

// Trace Request

export type VerifyTraceReq = ChainReq & {
  hash: string;
};

// Token Id Request

export type TokenIdReq = {
  token: string;
  showSkeleton: boolean;
};

// Token Price Rquest

export type TokenPriceReq = {
  token_id: string;
  days: string;
  currency: string;
  showSkeleton: boolean;
};

// Ticket (tx_hash) request

export type TicketReq = ChainReq & {
  ticket: string;
};

// Denom based request

export type DenomReq = {
  denom: string;
};

// "/verified_denoms"
// Takes <null>

export type VerifiedDenom = Denom & { chain_name: string };
export type VerifiedDenoms = Array<VerifiedDenom>;
export type VerifiedDenomsResponse = {
  verified_denoms: VerifiedDenoms;
};

// "/chains"
// Takes <null>

export type SupportedChain = {
  chain_name: string;
  display_name: string;
  logo: string;
};
export type ChainsResponse = {
  chains: Array<SupportedChain>;
};

// "/prices"
// Takes <null>

export type Price = {
  Symbol: string;
  Price: number;
};
export type Prices = {
  Fiats: Price[];
  Tokens: (Price & { Supply: number })[];
};
export type PricesResponse = {
  data: Prices;
  message: string | null;
  status: number;
};

// "/chain/{chainName}"
// Takes ChainReq

export type Chain = SupportedChain & {
  block_explorer?: string;
  cosmos_sdk_version?: string;
  demeris_addresses?: Array<string>;
  denoms?: Array<Denom>;
  derivation_path?: string;
  enabled?: boolean;
  genesis_hash?: string;
  node_info?: NodeInfo;
  primary_channel?: Record<string, string>;
  public_node_endpoints?: {
    tendermint_rpc?: string[];
    cosmos_api?: string[];
  };
  status?: boolean;
  supported_wallets?: string[];
  valid_block_thresh?: string;
};
export type ChainResponse = {
  chain: Chain;
};

// "/chain/{chainName}/status"
// Takes ChainReq

export type ChainStatusResponse = {
  online: boolean;
};

// "/chain/{chainName}/mint/annual_provisions"
// Takes ChainReq

export type AnnualProvisionsResponse = {
  annual_provisions: string;
};

// "/chain/{chainName}/mint/inflation"
// Takes ChainReq

export type InflationResponse = {
  inflation: string;
};

// "/chain/{chainName}/mint/params"
// Takes ChainReq

export type MintParams = {
  blocks_per_year: string;
  goal_bonded: string;
  inflation_max: string;
  inflation_min: string;
  inflation_rate_change: string;
  mint_denom: string;
};
export type MintParamsResponse = {
  params: MintParams;
};

// "/chain/{chainName}/staking/params"
// Takes ChainReq

export type StakingParams = {
  chain_name: string;
  unbonding_time: number;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
};
export type StakingParamsResponse = {
  params: StakingParams;
};

//  "/chain/{chainName}/apr"
//  Takes ChainReq

export type ChainAPR = {
  apr: string;
}

// "/chain/{chainName}/validators"
// Takes ChainReq

export type Validator = {
  chain_name: string;
  commission_rate: string;
  consensus_pubkey_type: string;
  consensus_pubkey_value: string;
  delegator_shares: string;
  details: string;
  identity: string;
  jailed: boolean;
  max_change_rate: string;
  max_rate: string;
  min_self_delegation: string;
  moniker: string;
  operator_address: string;
  status: number;
  tokens: string;
  unbonding_height: number;
  unbonding_time: string;
  update_time: string;
  website: string;
  avatar: string;
  stakedAmount?: string;
  
};
export type ValidatorsResponse = {
  validators: Array<Validator>;
};

// "/chain/{chainName}/numbers/{address}"
// Takes ChainAddrReq

export type SeqNumber = {
  chain_name: string;
  address: string;
  sequence_number: number;
  account_number: number;
};
export type NumbersResponse = {
  numbers: SeqNumber;
};

// "/chain/{chainName}/delegatorrewards/{address}""
// Takes ChainAddrReq

export type StakingReward = {
  validator_address: string;
  reward: string;
};
export type StakingRewardsResponse = {
  rewards: StakingReward[];
  total: string;
};

// "/chain/{chainName}/primary_channel/{counterparty}"
// Takes ChainCounterPartyReq

export type PrimaryChannelResponse = {
  primary_channel: PrimaryChannel;
};

// "/tx/{chainName}/{destinationChainName/{txHash}}"
// Takes DestinationTXReq

export type DestinationTXResponse = {
  dest_chain: string;
  cause?: string;
  tx_hash: string;
};

// "/chain/{chainName}/denom/verify_trace/{hash}"
// Takes VerifyTraceReq

export type VerifyTrace = {
  ibc_denom: string;
  base_denom: string;
  cause?: string;
  verified: boolean;
  path: string;
  trace: Array<Trace>;
};
export type VerifyTraceResponse = {
  verify_trace: VerifyTrace;
};

// "/balances/{address}"
// Takes AddrReq

export type Balance = {
  address: string;
  base_denom: string;
  verified: boolean;
  amount: string;
  on_chain: string;
  ibc: IbcInfo | Record<string, never>;
};
export type Balances = Array<Balance>;
export type BalancesResponse = {
  balances: Balances;
};

// "/staking_balances/{address}"
// Takes AddrReq

export type StakingBalance = {
  validator_address: string;
  amount: string;
  chain_name: string;
};
export type StakingBalances = Array<StakingBalance>;
export type StakingBalancesResponse = {
  staking_balances: StakingBalances;
};

// "/unbonding_delegations/{address}"
// Takes AddrReq

export type UnbondingDelegationEntry = {
  balance: string;
  completion_time: string;
  creation_height: number;
  initial_balance: string;
};
export type UnbondingDelegation = {
  validator_address: string;
  entries: UnbondingDelegationEntry[];
  chain_name: string;
};
export type UnbondingDelegations = Array<UnbondingDelegation>;
export type UnbondingDelegationsResponse = {
  unbonding_delegations: UnbondingDelegations;
};

// "/tx/ticket/{chainName}/{ticket}"
// Takes TicketReq

export type TxHashEntry = {
  Chain: string;
  Status: string;
  TxHash: string;
};
export type TicketResponse = {
  status: string;
  height?: number;
  newTicket?: string;
  error?: string;
  info?: string;
  owner?: string;
  tx_hashes?: Array<TxHashEntry>;
};

// "/chain/{chainName}/txs/{txhash}"
// Takes TicketReq

export type TransactionDetailResponse = {
  tx: {
    body: {
      messages: { "@type": string; [key: string]: any }[];
      memo: string;
    };
    auth_info: {
      fee: { amount: Amount[]; gas_limit: string };
    };
    signatures: string[];
  };
  tx_response: {
    height: string;
    txhash: string;
    gas_wanted: string;
    gas_used: string;
    tx: {
      "@type": string;
      body: {
        messages: { "@type": string; [key: string]: any }[];
        memo: string;
      };
      auth_info: {
        fee: { amount: Amount[]; gas_limit: string };
      };
      signatures: [];
    };
    timestamp: string;
  };
};

// "/oracle/chart/{tokenId}?days={days}&vs_currency={currency}"
// Takes TokenPriceReq

export type TokenPriceResponse = {
  data: {
    id: string;
    market_caps: Array<[number, number]>;
    name: string;
    prices: Array<[number, number]>;
    symbol: string;
    total_volumes: Array<[number, number]>;
  };
  message: string | null;
  status: number;
};

// "/oracle/geckoid?names={token}"
// Takes TokenIdReq

export type TokenIdResponse = {
  data: Record<string,string>;
  message: string | null;
  status: number;
};