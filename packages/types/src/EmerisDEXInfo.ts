import { Static, Type } from "@sinclair/typebox";
export  const Denom = Type.Strict(Type.Object({
	name: Type.String(),
	displayName: Type.String(),
	denom: Type.String(),
	baseDenom: Type.String(),
	precision: Type.Number()
}));
export enum DEX {
	Gravity = 'gravity',
	Osmosis = 'osmosis',
	Sifchain = 'sifchain'
}
export enum SwapType {
	Pool = 'pool',
	Swap = 'swap'
}
export  const Swap = Type.Strict(Type.Object({
	name: Type.String(),
	id: Type.String(),
	chainId: Type.String(),
	protocol: Type.Enum(DEX),
	denomA: Denom,
	balanceA: Type.String(),
	weightA: Type.Number(),
	denomB: Denom,
	swapPrice: Type.String(),
	balanceB: Type.String(),
	weightB: Type.Number(),
	swapType: Type.Enum(SwapType)
}));
export  const Swaps = Type.Array(Swap);

export const SwapsResponse = Type.Strict(Type.Object({
  swaps: Swaps
}));
export type Denom = Static<typeof Denom>;
export type Swap = Static<typeof Swap>;
export type Swaps = Static<typeof Swaps>;
export type SwapsResponse = Static<typeof SwapsResponse>;
