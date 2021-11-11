declare module "EmerisBase" {
    export type Amount = {
        denom: string;
        amount: string;
    };
    export type ChainAmount = {
        amount: Amount;
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
}
declare module "EmerisAPI" {
    import * as Base from "EmerisBase";
    export type AddrReq = {
        address: string;
    };
    export type HeightReq = {
        height: number;
    };
    export type ChainAddrReq = {
        chain_name: string;
        address: string;
    };
    export type ChainReq = {
        chain_name: string;
        destination_chain_name?: string;
    };
    export type TicketReq = {
        chain_name: string;
        ticket: string;
    };
    export type VerifyTraceReq = {
        chain_name: string;
        hash: string;
    };
    export type APIError = {
        cause: string;
        id: string;
        namespace: string;
    };
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
    export type DelegatorReward = {
        reward: string;
        validator_address: string;
    };
    export type DelegatorRewards = Array<DelegatorReward>;
    export type DelegatorRewardsResponse = {
        rewards: DelegatorRewards;
    };
    export type SeqNumber = {
        chain_name: string;
        address: string;
        sequence_number: string;
        account_number: string;
    };
    export type Numbers = Array<SeqNumber>;
    export type NumbersResponse = {
        numbers: Array<Numbers>;
    };
    export type StakingBalance = {
        validator_address: string;
        amount: string;
        chain_name: string;
    };
    export type StakingBalances = Array<StakingBalance>;
    export type StakingBalancesResponse = {
        staking_balances: StakingBalances;
    };
    export type UnbondingDelegationEntry = {
        balance: string;
        completion_time: string;
        creation_height: number;
        initial_balance: string;
    };
    export type UnbondingDelegation = {
        chain_name: string;
        entries: Array<UnbondingDelegationEntry>;
        validator_address: string;
    };
    export type UnbondingDelegations = Array<UnbondingDelegation>;
    export type UnbondingDelegationsResponse = {
        unbonding_delegations: UnbondingDelegations;
    };
    export type BlockHeightResponse = {
        id: string;
        jsonrpc: string;
        result: Record<string, unknown>;
    };
    export type APIGasPrice = {
        average: number;
        high: number;
        low: number;
    };
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
    };
    export type APIBech32Config = {
        main_prefix: string;
        prefix_account: string;
        prefix_validator: string;
        prefix_consensus: string;
        prefix_public: string;
        prefix_operator: string;
    };
    export type APINodeInfo = {
        endpoint: string;
        chain_id: string;
        bech32_config: APIBech32Config;
    };
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
        supported_wallets: Array<string>;
        valid_block_thresh: string;
    };
    export type ChainResponse = {
        chain: APIChain;
    };
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
    export type AnnualProvisionsResponse = {
        annual_provisions: string;
    };
    export type InflationResponse = {
        inflation: string;
    };
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
    export type APIPrimaryChannel = {
        counterparty: string;
        channel_name: string;
    };
    export type PrimaryChannelsResponse = {
        primary_channels: Array<APIPrimaryChannel>;
    };
    export type PrimaryChannelResponse = {
        primary_channels: APIPrimaryChannel;
    };
    export type ChainStatusResponse = {
        online: boolean;
    };
    export type TxsResponse = {
        tx: Record<string, unknown>;
        tx_response: Record<string, unknown>;
    };
    export type APISupportedChain = {
        chain_name: string;
        display_name: string;
        logo: string;
    };
    export type ChainsResponse = {
        chains: Array<APISupportedChain>;
    };
    export type RelayerBalance = {
        address: string;
        chain_name: string;
        enough_balance: boolean;
    };
    export type RelayerBalances = RelayerBalance[];
    export type RelayerBalancesResponse = {
        balances: RelayerBalances;
    };
    export type RelayerStatusResponse = {
        running: boolean;
    };
    export type TxHashEntry = {
        chain: string;
        status: string;
        txHash: string;
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
    export type VerifiedDenom = APIDenom & {
        chain_name: string;
    };
    export type VerifiedDenoms = Array<VerifiedDenom>;
    export type VerifiedDenomsResponse = {
        verified_denoms: VerifiedDenoms;
    };
    export type Price = {
        Symbol: string;
        Price: number;
    };
    export type Prices = {
        Fiats: Price[];
        Tokens: (Price & {
            Supply: number;
        })[];
    };
    export type PricesResponse = {
        data: Prices;
        message: string | null;
        status: number;
    };
}
declare module "EmerisDEXInfo" {
    export type Denom = {
        name: string;
        displayName: string;
        denom: string;
        baseDenom: string;
        precision: number;
    };
    export enum DEX {
        Gravity = "gravity",
        Osmosis = "osmosis",
        Sifchain = "sifchain"
    }
    export type Pool = {
        name: string;
        id: string;
        chainId: string;
        protocol: DEX;
        denomA: Denom;
        denomB: Denom;
        poolPrice: string;
    };
    export type Pools = Pool[];
    export type PoolsResponse = {
        pools: Pools;
    };
}
declare module "EmerisTransactions" {
    import * as API from "EmerisAPI";
    import * as Base from "EmerisBase";
    export type FeeWDenom = {
        amount: API.APIGasPrice;
        denom: string;
        chain_name: string;
    };
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
        pool: Pool;
        orderPrice: number;
        offerFee: number;
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
        type: 'ibcTransfer' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity' | 'createpool';
        chainId: string;
        protocol: string;
        data: TransactionType;
    };
    export type TransactionData = IBCData | SwapData | TransferData | AddLiquidityData | WithdrawLiquidityData | CreatePoolData;
    export type TransactionSignRequest = {
        signingAddress: string;
        chainTxData: any;
        transaction: Transaction<TransactionData>;
    };
}
declare module "EmerisFees" {
    import { Denom } from "EmerisDEXInfo";
    import { Transaction, TransactionData } from "EmerisTransactions";
    export type BaseFee = {
        denom: Denom;
        amount: string;
    };
    export type EstimatedFee = {
        transactionFees: BaseFee[];
        additionalFees: BaseFee[];
    };
    export type EstimatedFeeResponse = {
        fee: EstimatedFee;
    };
    export type EstimatedFeeRequest = {
        tx: Transaction<TransactionData>;
    };
}
//# sourceMappingURL=index.d.ts.map