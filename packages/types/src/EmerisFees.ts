import { Static, Type } from "@sinclair/typebox";
import { Denom } from "./EmerisDEXInfo";
import { Transaction, TransactionData } from "./EmerisTransactions";

export enum GasPriceLevel {
	Low = 'low',
	Average = 'average',
	High = 'high'
}

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

export const FeesRequest = Type.Strict(Type.Array(Type.Object({
	gasPriceLevel: Type.Optional(Type.Enum(GasPriceLevel)),
	tx: Type.Any()
})));

export const FeesResponse = Type.Strict(Type.Array(Type.Object({
	gasUsed: Type.String(),
	fee: Type.Array(Coin),
	totalUSD: Type.Number()
})));
export type FeesRequest = Static<typeof FeesRequest>
export type FeesResponse = Static<typeof FeesResponse>