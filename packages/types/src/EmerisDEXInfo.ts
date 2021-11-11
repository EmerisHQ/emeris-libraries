export type Denom = {
	name: string;
	displayName: string;
	denom: string;
	baseDenom: string;
	precision: number;
}

export enum DEX {
	Gravity = 'gravity',
	Osmosis = 'osmosis',
	Sifchain = 'sifchain'
}

export type Pool = {
	name: string;
	id: string;
	chainId: string;
	protocol: DEX;
	denomA: Denom;
	denomB: Denom;
	poolPrice: string;
}

export type Pools = Pool[];

export type PoolsResponse = {
	pools: Pools;
}
