import { EmerisTransactions } from "@emeris/types";
import { EmerisMessageMapper } from "../../EmerisMessageMapper";
import * as Long  from "long";

export default class CosmosAminoMessageMapper extends EmerisMessageMapper {

    transfer(transaction: EmerisTransactions.AbstractTransferTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgSend",
            value: {
                amount: [this.normalizeAmount(transaction.amount)],
                // @ts-ignore
                to_address: transaction.toAddress,
                from_address: signing_address,
            },
        };
    }

    IBCtransferBackward(transaction: EmerisTransactions.AbstractIBCTransferTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgTransfer",
            value: {
                source_port: 'transfer',
                source_channel: transaction.through,
                sender: signing_address,
                // @ts-ignore
                receiver: transaction.toAddress,
                timeout_timestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
                //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
                token: this.normalizeAmount(transaction.amount),
            }
        }
    }
    IBCtransferForward(transaction: EmerisTransactions.AbstractIBCTransferTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgTransfer",
            value: {
                source_port: 'transfer',
                source_channel: transaction.through,
                sender: signing_address,
                // @ts-ignore
                receiver: transaction.toAddress,
                timeout_timestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
                //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
                token: this.normalizeAmount(transaction.amount),
            }
        }
    }
    unstake(transaction: EmerisTransactions.AbstractUnstakeTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgUndelegate",
            value: {
                delegator_address: signing_address,
                validator_address: transaction.validatorAddress,
                amount: this.normalizeAmount(transaction.amount),
            }
        }      
    }
    switch(transaction: EmerisTransactions.AbstractRestakeTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgBeginRedelegate",
            value: {
                delegator_address: signing_address,
                validator_src_address: transaction.validatorSrcAddress,
                validator_dst_address: transaction.validatorDstAddress,
                amount: this.normalizeAmount(transaction.amount),
            }
        }      
    }
    stake(transactions: EmerisTransactions.AbstractStakeTransactionData[], signing_address: string) {
        return transactions.map((transaction) => ({
            type: "cosmos-sdk/MsgDelegate",
            value: {
                delegator_address: signing_address,
                validator_address: transaction.validatorAddress,
                amount: this.normalizeAmount(transaction.amount),
            }
        }))
    }
    claim(transaction: EmerisTransactions.AbstractClaimRewardsTransactionData, signing_address: string) {
        return transaction.rewards.map((transaction) => ({
            type: "cosmos-sdk/MsgWithdrawDelegationReward",
            value: {
                delegator_address: signing_address,
                validator_address: transaction.validator_address
            }
        }))
    }
}