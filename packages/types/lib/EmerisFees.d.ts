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
//# sourceMappingURL=EmerisFees.d.ts.map