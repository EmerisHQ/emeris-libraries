import { Static, Type } from "@sinclair/typebox";
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

const Coin = Type.Strict(Type.Object({
	denom: Type.String(),
	amount: Type.String()
}))

export const FeesRequest = Type.Strict(Type.Object({
	tx: Type.Any(),
}));
export const FeesResponse = Type.Strict(Type.Object({
	GasWanted: Type.String(),
	GasUsed: Type.String(),
	Fees: Type.Array(Coin)
}));
export type FeesRequest = Static<typeof FeesRequest>
export type FeesResponse = Static<typeof FeesResponse>