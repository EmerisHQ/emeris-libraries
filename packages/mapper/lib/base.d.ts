import { EmerisTransactions } from "@emeris/types";
export declare class EmerisMessageMapper {
    chain_id: string;
    constructor(chain_id: string);
    map(transaction: EmerisTransactions.Transaction<EmerisTransactions.TransactionData>, signing_address: string): void;
    transfer(transaction: EmerisTransactions.TransferData, signing_address: string): void;
    ibcTransfer(transaction: EmerisTransactions.IBCData, signing_address: string): void;
    swap(transaction: EmerisTransactions.SwapData, signing_address: string): void;
    addliquidity(transaction: EmerisTransactions.AddLiquidityData, signing_address: string): void;
    withdrawliquidity(transaction: EmerisTransactions.WithdrawLiquidityData, signing_address: string): void;
    createpool(transaction: EmerisTransactions.CreatePoolData, signing_address: string): void;
}
//# sourceMappingURL=base.d.ts.map