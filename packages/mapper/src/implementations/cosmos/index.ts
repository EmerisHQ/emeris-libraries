import { EmerisTransactions } from "@emeris/types";
import { EmerisMessageMapper } from "../../EmerisMessageMapper";
import * as Long  from "long";

export default class CosmosAminoMessageMapper extends EmerisMessageMapper {

    transfer(transaction: EmerisTransactions.AbstractTransferTransactionData, signing_address: string) {
        return {
            type: "cosmos-sdk/MsgSend",
            value: {
                amount: [{
                    amount: String(transaction.amount.amount),
                    denom: transaction.amount.denom
                }],
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
                token: { ...transaction.amount },
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
                token: { ...transaction.amount },
            }
        }
    }

}