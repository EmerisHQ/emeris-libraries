import * as Base from './EmerisBase';
export declare type AddrReq = {
    address: string;
};
export declare type HeightReq = {
    height: number;
};
export declare type ChainAddrReq = {
    chain_name: string;
    address: string;
};
export declare type ChainReq = {
    chain_name: string;
    destination_chain_name?: string;
};
export declare type TicketReq = {
    chain_name: string;
    ticket: string;
};
export declare type VerifyTraceReq = {
    chain_name: string;
    hash: string;
};
export declare type APIError = {
    cause: string;
    id: string;
    namespace: string;
};
export declare type Balance = {
    address: string;
    amount: string;
    base_denom: string;
    ibc: Base.IbcInfo | Record<string, never>;
    on_chain: string;
    verified: boolean;
};
export declare type Balances = Array<Balance>;
export declare type BalancesResponse = {
    balances: Balances;
};
export declare type DelegatorReward = {
    reward: string;
    validator_address: string;
};
export declare type DelegatorRewards = Array<DelegatorReward>;
export declare type DelegatorRewardsResponse = {
    rewards: DelegatorRewards;
};
export declare type SeqNumber = {
    chain_name: string;
    address: string;
    sequence_number: string;
    account_number: string;
};
export declare type Numbers = Array<SeqNumber>;
export declare type NumbersResponse = {
    numbers: Array<Numbers>;
};
export declare type StakingBalance = {
    validator_address: string;
    amount: string;
    chain_name: string;
};
export declare type StakingBalances = Array<StakingBalance>;
export declare type StakingBalancesResponse = {
    staking_balances: StakingBalances;
};
export declare type UnbondingDelegationEntry = {
    balance: string;
    completion_time: string;
    creation_height: number;
    initial_balance: string;
};
export declare type UnbondingDelegation = {
    chain_name: string;
    entries: Array<UnbondingDelegationEntry>;
    validator_address: string;
};
export declare type UnbondingDelegations = Array<UnbondingDelegation>;
export declare type UnbondingDelegationsResponse = {
    unbonding_delegations: UnbondingDelegations;
};
export declare type BlockHeightResponse = {
    id: string;
    jsonrpc: string;
    result: Record<string, unknown>;
};
export declare type APIGasPrice = {
    average: number;
    high: number;
    low: number;
};
export declare type APIDenom = {
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
};
export declare type APIBech32Config = {
    main_prefix: string;
    prefix_account: string;
    prefix_validator: string;
    prefix_consensus: string;
    prefix_public: string;
    prefix_operator: string;
};
export declare type APINodeInfo = {
    endpoint: string;
    chain_id: string;
    bech32_config: APIBech32Config;
};
export declare type APIChain = {
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
    supported_wallets: Array<string>;
    valid_block_thresh: string;
};
export declare type ChainResponse = {
    chain: APIChain;
};
export declare type Trace = {
    channel: string;
    port: string;
    client_id: string;
    chain_name: string;
    counterparty_name: string;
};
export declare type VerifyTrace = {
    ibc_denom: string;
    base_denom: string;
    cause: string;
    verified: boolean;
    path: string;
    trace: Array<Trace>;
};
export declare type VerifyTraceResponse = {
    verify_trace: VerifyTrace;
};
export declare type AnnualProvisionsResponse = {
    annual_provisions: string;
};
export declare type InflationResponse = {
    inflation: string;
};
export declare type MintParams = {
    blocks_per_year: string;
    goal_bonded: string;
    inflation_max: string;
    inflation_min: string;
    inflation_rate_change: string;
    mint_denom: string;
};
export declare type MintParamsResponse = {
    params: MintParams;
};
export declare type APIPrimaryChannel = {
    counterparty: string;
    channel_name: string;
};
export declare type PrimaryChannelsResponse = {
    primary_channels: Array<APIPrimaryChannel>;
};
export declare type PrimaryChannelResponse = {
    primary_channels: APIPrimaryChannel;
};
export declare type ChainStatusResponse = {
    online: boolean;
};
export declare type TxsResponse = {
    tx: Record<string, unknown>;
    tx_response: Record<string, unknown>;
};
export declare type APISupportedChain = {
    chain_name: string;
    display_name: string;
    logo: string;
};
export declare type ChainsResponse = {
    chains: Array<APISupportedChain>;
};
export declare type RelayerBalance = {
    address: string;
    chain_name: string;
    enough_balance: boolean;
};
export declare type RelayerBalances = RelayerBalance[];
export declare type RelayerBalancesResponse = {
    balances: RelayerBalances;
};
export declare type RelayerStatusResponse = {
    running: boolean;
};
export declare type TxHashEntry = {
    chain: string;
    status: string;
    txHash: string;
};
export declare type TicketResponse = {
    status: string;
    height?: number;
    newTicket?: string;
    error?: string;
    info?: string;
    owner?: string;
    tx_hashes?: Array<TxHashEntry>;
};
export declare type VerifiedDenom = APIDenom & {
    chain_name: string;
};
export declare type VerifiedDenoms = Array<VerifiedDenom>;
export declare type VerifiedDenomsResponse = {
    verified_denoms: VerifiedDenoms;
};
export declare type Price = {
    Symbol: string;
    Price: number;
};
export declare type Prices = {
    Fiats: Price[];
    Tokens: (Price & {
        Supply: number;
    })[];
};
export declare type PricesResponse = {
    data: Prices;
    message: string | null;
    status: number;
};
//# sourceMappingURL=EmerisAPI.d.ts.map