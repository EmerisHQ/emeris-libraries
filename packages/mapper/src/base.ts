import { EmerisTransactions } from "@emeris/types";

export class EmerisMessageMapper {
    public chain_id: string;

    constructor(chain_id:string) {
        this.chain_id = chain_id
    }

    map(transaction: EmerisTransactions.Transaction<EmerisTransactions.TransactionData>, signing_address: string) {
        // @ts-expect-error
        return this[transaction.type](transaction.data, signing_address)
    }

    transfer(transaction: EmerisTransactions.TransferData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    ibcTransfer(transaction: EmerisTransactions.IBCData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    swap(transaction: EmerisTransactions.SwapData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    addliquidity(transaction: EmerisTransactions.AddLiquidityData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    withdrawliquidity(transaction: EmerisTransactions.WithdrawLiquidityData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    createpool(transaction: EmerisTransactions.CreatePoolData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
}