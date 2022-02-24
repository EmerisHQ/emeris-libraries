
import * as Base from './EmerisBase';

// REQUESTS

// Params object for actions requiring a BECH32 decoded address as param
export type AddrReq = {
  address: string;
};
export type HeightReq = {
	height: number;
}
export type ChainAddrReq = {
  chain_name: string;
  address: string;
};
// Params object for actions requiring a chain name (and optionally a target chain)
export type ChainReq = {
  chain_name: string;
  destination_chain_name?: string;
};
export type TicketReq = {
  chain_name: string;
  ticket: string;
};
// Params object for verifying a specific trace hash on a specific chain
export type VerifyTraceReq = {
  chain_name: string;
  hash: string;
};

// GENERIC ERROR

export type APIError = {
	cause: string;
	id: string;
	namespace: string;
}

// MODELS & RESPONSES


// "/account/{address}/balance"
// Takes AddrReq

export type Balance = {
  address: string;
  amount: string;
  base_denom: string;
  ibc: Base.IbcInfo | Record<string, never>;
  on_chain: string;
  verified: boolean;
};
export type Balances = Array<Balance>;
export type BalancesResponse = {
  balances: Balances;
};

// "/account/{address}/delegatorrewards/{chain}"
// Takes ChainAddrReq

export type DelegatorReward = {
	reward: string;
	validator_address: string;
}
export type DelegatorRewards = Array<DelegatorReward>;
export type DelegatorRewardsResponse = {
	rewards: DelegatorRewards;
}

// "/account/{address}/numbers"
// Takes AddrReq

export type SeqNumber = {
  chain_name: string;
  address: string;
  sequence_number: number;
  account_number: number;
};
export type Numbers = Array<SeqNumber>;
export type NumbersResponse = {
  numbers: Array<Numbers>;
};

// "/account/{address}/stakingbalance"
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

// "/account/{address}/unbondingdelegations"
// Takes AddrReq

export type UnbondingDelegationEntry = {
	balance: string;
	completion_time: string;
	creation_height: number;
	initial_balance: string;
}
export type UnbondingDelegation = {
	chain_name: string;
	entries: Array<UnbondingDelegationEntry>;
  validator_address: string;
}
export type UnbondingDelegations = Array<UnbondingDelegation>;
export type UnbondingDelegationsResponse = {
	unbonding_delegations: UnbondingDelegations;
}
// "/block_results?height={height}"
// Takes HeightReq

export type BlockHeightResponse = {
	id: string;
	jsonrpc: string;
	result: Record<string,unknown> // TODO: Potentially replace with proper response typing of Tendermint RPC
}

// "/chain/{chainName}"
// Takes ChainReq

export type APIGasPrice = {
	average: number;
	high: number;
	low: number;
}
export type APIDenom = {
	display_name: string;
	fee_token: boolean;
	fetch_price: boolean;
	gas_price_levels: APIGasPrice;
	logo: string;
	minimum_thresh_relayer_balance: number;
	name: string;
	precision: number;
	price_id: string;
	relayer_denom: boolean;
	stakable: boolean;
	ticker: string;
	verified: boolean;
}
export type APIBech32Config = {
  main_prefix: string;
  prefix_account: string;
  prefix_validator: string;
  prefix_consensus: string;
  prefix_public: string;
  prefix_operator: string;	
}
export type APINodeInfo = {
	endpoint: string;
	chain_id: string;
	bech32_config: APIBech32Config;
}
export type APIChain = {
	block_explorer?: string;
	chain_name: string;
	demeris_addresses: Array<string>;
	denoms: Array<APIDenom>;
	derivation_path: string;
	display_name: string;
	enabled: boolean;
	genesis_hash: string;
	logo: string;
	node_info: APINodeInfo;
	primary_channel: Record<string, string>;
	supported_wallets: Array<string>
	valid_block_thresh: string;
}
export type ChainResponse = {
	chain: APIChain;
}

// "/chain/{chainName}/denom/verify_trace/{hash}"
// Takes VerifyTraceReq

export type Trace = {
  channel: string;
  port: string;
  client_id: string;
  chain_name: string;
  counterparty_name: string;
};
export type VerifyTrace = {
  ibc_denom: string;
	base_denom: string;
	cause: string;
  verified: boolean;
  path: string;
  trace: Array<Trace>;
};
export type VerifyTraceResponse = {
  verify_trace: VerifyTrace;
};

// "/chain/{chainName}/mint/annual_provisions"
// Takes ChainReq

export type AnnualProvisionsResponse = {
	annual_provisions: string;
}

// "/chain/{chainName}/mint/inflation"
// Takes ChainReq

export type InflationResponse = {
	inflation: string;
}

// "/chain/{chainName}/mint/params"
// Takes ChainReq

export type MintParams = {
	blocks_per_year: string;
	goal_bonded: string;
	inflation_max: string;
	inflation_min: string;
	inflation_rate_change: string;
	mint_denom: string;
}
export type MintParamsResponse = {
	params: MintParams;
}

// "/chain/{chainName}/primary_channels"
// Takes ChainReq
export type APIPrimaryChannel = {
	counterparty: string;
	channel_name: string;
}
export type PrimaryChannelsResponse = {
	primary_channels: Array<APIPrimaryChannel>;
}

// "/chain/{chainName}/primary_channel/{counterparty}"
// Takes ChainReq

export type PrimaryChannelResponse = {
	primary_channels: APIPrimaryChannel;
}

// "/chain/{chainName}/status"
// Takes ChainReq

export type ChainStatusResponse = {
	online: boolean;
}

// "/chain/{chainName}/txs/{txhash}"
// Takes TicketReq

export type TxsResponse = {
	tx: Record<string, unknown> // TODO
	tx_response: Record<string,unknown> //TODO
}

// "/chains"
// Takes <null>

export type APISupportedChain = {
	chain_name: string;
	display_name: string;
	logo: string;
}
export type ChainsResponse = {
	chains: Array<APISupportedChain>;
}

// "/relayer/balance"
// Takes <null>

export type RelayerBalance = {
  address: string;
  chain_name: string;
  enough_balance: boolean;
};
export type RelayerBalances = RelayerBalance[];

export type RelayerBalancesResponse = {
  balances: RelayerBalances;
};

// "/relayer/status"
// Takes <null>

export type RelayerStatusResponse = {
  running: boolean;
};

// "/tx/ticket/{chainName}/{ticketId}"
// Takes TicketReq

export type TxHashEntry = {
	chain: string;
	status: string;
	txHash: string;
}
export type TicketResponse = {
  status: string;
  height?: number;
  newTicket?: string;
	error?: string;
	info?: string;
	owner?: string;
	tx_hashes?: Array<TxHashEntry>
};

// "/verified_denoms"
// Takes <null>

export type VerifiedDenom = APIDenom & { chain_name: string };
export type VerifiedDenoms = Array<VerifiedDenom>;
export type VerifiedDenomsResponse = {
  verified_denoms: VerifiedDenoms;
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