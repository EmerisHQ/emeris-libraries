import { Static } from "@sinclair/typebox";
import { Denom } from "./EmerisDEXInfo";
import { Transaction, TransactionData } from "./EmerisTransactions";
export declare type BaseFee = {
    denom: Denom;
    amount: string;
};
export declare type EstimatedFee = {
    transactionFees: BaseFee[];
    additionalFees: BaseFee[];
};
export declare type EstimatedFeeResponse = {
    fee: EstimatedFee;
};
export declare type EstimatedFeeRequest = {
    tx: Transaction<TransactionData>;
};
export declare const FeesRequest: import("@sinclair/typebox").TObject<{
    tx: import("@sinclair/typebox").TAny;
}>;
export declare const FeesResponse: import("@sinclair/typebox").TObject<{
    GasWanted: import("@sinclair/typebox").TString;
    GasUsed: import("@sinclair/typebox").TString;
    Fees: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        denom: import("@sinclair/typebox").TString;
        amount: import("@sinclair/typebox").TString;
    }>>;
}>;
export declare type FeesRequest = Static<typeof FeesRequest>;
export declare type FeesResponse = Static<typeof FeesResponse>;
//# sourceMappingURL=EmerisFees.d.ts.map