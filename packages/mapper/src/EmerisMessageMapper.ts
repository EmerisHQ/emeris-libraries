import { EmerisBase, EmerisTransactions } from "@emeris/types";


export class EmerisMessageMapper {
    public chain_id: string;

    constructor(chain_id: string) {
        this.chain_id = chain_id
    }
    normalizeAmount(amount: EmerisTransactions.AbstractAmount): EmerisBase.Amount {
        return { amount: amount.amount + '', denom: amount.denom };
    }
    map(transaction: EmerisTransactions.AbstractTransaction, signing_address: string) {
        switch (transaction.type) { // TS Ugliness to ensure data types are correctly inferred in mapping functions
            case 'transfer':
                return this[transaction.type](transaction.data, signing_address)
            case 'IBCtransferBackward':
                return this[transaction.type](transaction.data, signing_address)
            case 'IBCtransferForward':
                return this[transaction.type](transaction.data, signing_address)
            case 'addLiquidity':
                return this[transaction.type](transaction.data, signing_address)
            case 'createPool':
                return this[transaction.type](transaction.data, signing_address)
            case 'withdrawLiquidity':
                return this[transaction.type](transaction.data, signing_address)
            case 'swap':
                return this[transaction.type](transaction.data, signing_address)
            case 'claim':
                return this[transaction.type](transaction.data, signing_address)
            case 'stake':
                return this[transaction.type](transaction.data, signing_address)
            case 'unstake':
                return this[transaction.type](transaction.data, signing_address)
            case 'switch':
                return this[transaction.type](transaction.data, signing_address)
            case 'custom':
                return transaction.data.raw
            default:
        }

    }

    transfer(_transaction: EmerisTransactions.AbstractTransferTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }


    IBCtransferBackward(_transaction: EmerisTransactions.AbstractIBCTransferTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    IBCtransferForward(_transaction: EmerisTransactions.AbstractIBCTransferTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    swap(_transaction: EmerisTransactions.AbstractSwapTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    addLiquidity(_transaction: EmerisTransactions.AbstractAddLiquidityTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    withdrawLiquidity(_transaction: EmerisTransactions.AbstractWithdrawLiquidityTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    createPool(_transaction: EmerisTransactions.AbstractCreatePoolTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
    claim(_transaction: EmerisTransactions.AbstractClaimRewardsTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
    stake(_transaction: EmerisTransactions.AbstractStakeTransactionData[], _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
    unstake(_transaction: EmerisTransactions.AbstractUnstakeTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
    switch(_transaction: EmerisTransactions.AbstractRestakeTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

}