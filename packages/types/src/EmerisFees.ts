import { Denom } from "./EmerisDEXInfo";
import { Transaction, TransactionData } from "./EmerisTransactions";

export type BaseFee = {
	denom: Denom;
	amount: string;
}
export type EstimatedFee = {
	transactionFees: BaseFee[];
	additionalFees: BaseFee[]
}
export type EstimatedFeeResponse = {
	fee: EstimatedFee;
}
export type EstimatedFeeRequest = {
	tx: Transaction<TransactionData>;
}