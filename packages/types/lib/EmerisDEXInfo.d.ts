import { Static } from "@sinclair/typebox";
export declare const Denom: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    displayName: import("@sinclair/typebox").TString;
    denom: import("@sinclair/typebox").TString;
    baseDenom: import("@sinclair/typebox").TString;
    precision: import("@sinclair/typebox").TNumber;
}>;
export declare enum DEX {
    Gravity = "gravity",
    Osmosis = "osmosis",
    Sifchain = "sifchain"
}
export declare enum SwapType {
    Pool = "pool",
    Swap = "swap"
}
export declare const Swap: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    id: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TString;
    protocol: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<DEX>[]>;
    denomA: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        displayName: import("@sinclair/typebox").TString;
        denom: import("@sinclair/typebox").TString;
        baseDenom: import("@sinclair/typebox").TString;
        precision: import("@sinclair/typebox").TNumber;
    }>;
    denomB: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        displayName: import("@sinclair/typebox").TString;
        denom: import("@sinclair/typebox").TString;
        baseDenom: import("@sinclair/typebox").TString;
        precision: import("@sinclair/typebox").TNumber;
    }>;
    swapPrice: import("@sinclair/typebox").TString;
    swapType: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<SwapType>[]>;
}>;
export declare const Swaps: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    id: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TString;
    protocol: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<DEX>[]>;
    denomA: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        displayName: import("@sinclair/typebox").TString;
        denom: import("@sinclair/typebox").TString;
        baseDenom: import("@sinclair/typebox").TString;
        precision: import("@sinclair/typebox").TNumber;
    }>;
    denomB: import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        displayName: import("@sinclair/typebox").TString;
        denom: import("@sinclair/typebox").TString;
        baseDenom: import("@sinclair/typebox").TString;
        precision: import("@sinclair/typebox").TNumber;
    }>;
    swapPrice: import("@sinclair/typebox").TString;
    swapType: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<SwapType>[]>;
}>>;
export declare const SwapsResponse: import("@sinclair/typebox").TObject<{
    swaps: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        name: import("@sinclair/typebox").TString;
        id: import("@sinclair/typebox").TString;
        chainId: import("@sinclair/typebox").TString;
        protocol: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<DEX>[]>;
        denomA: import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            displayName: import("@sinclair/typebox").TString;
            denom: import("@sinclair/typebox").TString;
            baseDenom: import("@sinclair/typebox").TString;
            precision: import("@sinclair/typebox").TNumber;
        }>;
        denomB: import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            displayName: import("@sinclair/typebox").TString;
            denom: import("@sinclair/typebox").TString;
            baseDenom: import("@sinclair/typebox").TString;
            precision: import("@sinclair/typebox").TNumber;
        }>;
        swapPrice: import("@sinclair/typebox").TString;
        swapType: import("@sinclair/typebox").TEnum<import("@sinclair/typebox").TEnumKey<SwapType>[]>;
    }>>;
}>;
export declare type Denom = Static<typeof Denom>;
export declare type Swap = Static<typeof Swap>;
export declare type Swaps = Static<typeof Swaps>;
export declare type SwapsResponse = Static<typeof SwapsResponse>;
//# sourceMappingURL=EmerisDEXInfo.d.ts.map