declare module "api" {
    export type EmerisGasPrices = {
        low: number;
        average: number;
        high: number;
    };
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
}
declare module "base" {
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
}
declare module "EmerisTransactions" {
    import * as API from "api";
    import * as Base from "base";
    export type FeeWDenom = {
        amount: API.Fee;
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
        addFee?: boolean;
        feeToAdd?: FeeWDenom[];
        data: TransactionType;
    };
    export type TransactionData = IBCData | SwapData | TransferData | AddLiquidityData | WithdrawLiquidityData | CreatePoolData;
    export type TransactionSignRequest = {
        chain_id: string;
        protocol: string;
        signing_address: string;
        chain_tx_data: any;
        transaction: Transaction<TransactionData>;
    };
}
//# sourceMappingURL=index.d.ts.map