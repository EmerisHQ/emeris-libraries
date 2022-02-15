import { AddLiquidityData, CreatePoolData, IBCData, SwapData, Transaction, TransactionData, TransferData, WithdrawLiquidityData } from "../../types/src/EmerisTransactions";

export class EmerisMessageMapper {
    chain_id = undefined

    constructor(chain_id) {
        this.chain_id = chain_id
    }

    map(transaction: Transaction<TransactionData>, signing_address: string) {
        return this[transaction.type](transaction, signing_address)
    }

    transfer(transaction: TransferData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    ibcTransfer(transaction: IBCData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    swap(transaction: SwapData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    addliquidity(transaction: AddLiquidityData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    withdrawliquidity(transaction: WithdrawLiquidityData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    createpool(transaction: CreatePoolData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
}