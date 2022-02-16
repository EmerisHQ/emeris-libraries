import { EmerisTransactions } from "@emeris/types";
import { EmerisMessageMapper } from "./base";
import * as Long from "long";
export default class CosmosAminoMessageMapper extends EmerisMessageMapper {
    transfer(transaction: EmerisTransactions.AbstractTransferTransactionData, signing_address: string): {
        type: string;
        value: {
            amount: EmerisTransactions.AbstractAmount[];
            to_address: string;
            from_address: string;
        };
    }[];
    IBCtransfer(transaction: EmerisTransactions.AbstractIBCTransferTransactionData, signing_address: string): {
        type: string;
        value: {
            source_port: string;
            source_channel: string;
            sender: string;
            receiver: string;
            timeout_timestamp: Long.Long;
            token: {
                denom: string;
                base_denom?: string | undefined;
                amount: string;
            };
        };
    }[];
    swap(transaction: EmerisTransactions.AbstractSwapTransactionData, signing_address: string): {
        type: string;
        value: {
            swap_requester_address: string;
            pool_id: number;
            swap_type_id: any;
            offer_coin: {
                amount: string;
                denom: string;
            };
            demand_coin_denom: string;
            offer_coin_dee: any;
            order_price: any;
        };
    }[];
    addliquidity(transaction: EmerisTransactions.AddLiquidityData, signing_address: string): {
        type: string;
        value: {
            depositor_address: string;
            pool_id: string;
            deposit_coins: import("@emeris/types/lib/EmerisBase").Amount[];
        };
    }[];
    withdrawliquidity(transaction: EmerisTransactions.WithdrawLiquidityData, signing_address: string): {
        type: string;
        value: {
            withdrawer_address: string;
            pool_id: string;
            pool_coin: {
                denom: string;
                amount: string;
            };
        };
    }[];
    createpool(transaction: EmerisTransactions.CreatePoolData, signing_address: string): {
        type: string;
        value: {
            pool_creator_address: string;
            pool_type_id: number;
            deposit_coins: import("@emeris/types/lib/EmerisBase").Amount[];
        };
    }[];
}
//# sourceMappingURL=cosmos_amino.d.ts.map