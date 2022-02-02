import { EmerisTransactions } from "@emeris/types";
import { EmerisMessageMapper } from "./base";
import * as Long from "long";
export default class CosmosAminoMessageMapper extends EmerisMessageMapper {
    transfer(transaction: EmerisTransactions.TransferData, signing_address: string): {
        type: string;
        value: {
            amount: import("@emeris/types/lib/EmerisBase").Amount[];
            to_address: string;
            from_address: string;
        };
    }[];
    ibcTransfer(transaction: EmerisTransactions.IBCData, signing_address: string): {
        type: string;
        value: {
            source_port: string;
            source_channel: string;
            sender: string;
            receiver: string | undefined;
            timeout_timestamp: Long.Long;
            token: {
                denom: string;
                amount: string;
            };
        };
    }[];
    swap(transaction: EmerisTransactions.SwapData, signing_address: string): {
        type: string;
        value: {
            swap_requester_address: string;
            pool_id: number;
            swap_type_id: number;
            offer_coin: {
                amount: string;
                denom: string;
            };
            demand_coin_denom: string;
            offer_coin_dee: number;
            order_price: number;
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