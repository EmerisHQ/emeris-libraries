export type Amount = {
    denom: string;
    amount: string;
};
export type ChainAmount = {
    amount: Amount;
    chain_name: string;
};

export type AmountWithMeta = Amount & {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
};
export type IbcInfo = {
  path: string;
  hash: string;
};
export enum ChainType {
    cosmos = 'cosmos',
    ethereum = 'ethereum'
}
export enum ChainLibraries {
    cosmjs = 'cosmjs',
    web3 = 'web3'
}