import { EmerisDEXInfo, EmerisTransactions } from "@emeris/types";

export class EmerisMessageMapper  {
    public chain_id: string;
    
    constructor(chain_id:string) {
        this.chain_id = chain_id
    }
    static async fromChainProtocol(chainName:string, protocol?:EmerisDEXInfo.DEX) {
        const { default: MappingClass }: {default: typeof EmerisMessageMapper} = await import('./implementations/' + chainName + '/'+ (protocol?protocol:''));        
        return new MappingClass(chainName);
    }
    map(transaction: EmerisTransactions.AbstractTransaction, signing_address: string) {
        switch (transaction.type) { // TS Ugliness to ensure data types are correctly inferred in mapping functions
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

    transfer(_transaction: EmerisTransactions.AbstractTransferTransactionData, _signing_address: string) {
        throw new Error("This method is not implemented for " + this.chain_id)
    }

    
    IBCtransfer(_transaction: EmerisTransactions.AbstractIBCTransferTransactionData, _signing_address: string) {
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
    
}