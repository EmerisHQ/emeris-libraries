import { Static, Type } from "@sinclair/typebox";
import { AbstractAmount, AbstractTransactionMappingRequest } from "./EmerisTransactions";

export enum GasPriceLevel {
	Low = 'low',
	Average = 'average',
	High = 'high'
}

export const FeesRequest = Type.Strict(Type.Object({
	gasPriceLevel: Type.Optional(Type.Enum(GasPriceLevel)),
	txs: Type.Array(AbstractTransactionMappingRequest)
}));

export const FeesResponse = Type.Strict(Type.Array(Type.Object({
	gasUsed: Type.String(),
	fee: Type.Array(AbstractAmount),
	totalUSD: Type.Number()
})));
export type FeesRequest = Static<typeof FeesRequest>
export type FeesResponse = Static<typeof FeesResponse>