"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmerisMessageMapper = void 0;
class EmerisMessageMapper {
    chain_id;
    constructor(chain_id) {
        this.chain_id = chain_id;
    }
    map(transaction, signing_address) {
        // @ts-expect-error
        return this[transaction.type](transaction.data, signing_address);
    }
    transfer(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
    ibcTransfer(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
    swap(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
    addliquidity(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
    withdrawliquidity(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
    createpool(transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    }
}
exports.EmerisMessageMapper = EmerisMessageMapper;
