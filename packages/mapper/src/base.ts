import { EmerisTransactions } from "@emeris/types";

export interface IEmerisMessageMapper {
    map: (transaction:EmerisTransactions.AbstractTransaction,signing_address:string) =>string;
    [EmerisTransactions.AbstractTransaction['type']]
}
export class EmerisMessageMapper  {
    public chain_id: string;

    constructor(chain_id:string) {
        this.chain_id = chain_id
    }
    keyof EmerisTransactions.AbstractTransaction['type'];
    map(transaction: EmerisTransactions.AbstractTransaction, signing_address: string) {
        switch (transaction.type) {
            case 'transfer':       
            return this[transaction.type](transaction.data, signing_address)
            case 'IBCtransfer':       
            return this[transaction.type](transaction.data, signing_address)
            case 'addLiquidity':       
            return this[transaction.type](transaction.data, signing_address)
            case 'createPool':       
            return this[transaction.type](transaction.data, signing_address)
            case 'withdrawLiquidity':       
            return this[transaction.type](transaction.data, signing_address)
            case 'swap':            
            return this[transaction.type](transaction.data, signing_address)
            default:
        }
        
    }

    transfer(transaction: EmerisTransactions.AbstractTransferTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    
    IBCtransfer(transaction: EmerisTransactions.AbstractIBCTransferTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    swap(transaction: EmerisTransactions.AbstractSwapTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    addLiquidity(transaction: EmerisTransactions.AbstractAddLiquidityTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    withdrawLiquidity(transaction: EmerisTransactions.AbstractWithdrawLiquidityTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    createPool(transaction: EmerisTransactions.AbstractCreatePoolTransactionData, signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }
    
}