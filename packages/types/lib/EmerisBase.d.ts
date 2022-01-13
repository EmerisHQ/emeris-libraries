export declare type Amount = {
    denom: string;
    amount: string;
};
export declare type ChainAmount = {
    amount: Amount;
    chain_name: string;
};
export declare type AmountWithMeta = Amount & {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
};
export declare type IbcInfo = {
    path: string;
    hash: string;
};
//# sourceMappingURL=EmerisBase.d.ts.map