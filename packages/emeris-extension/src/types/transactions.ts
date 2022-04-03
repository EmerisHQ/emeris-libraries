import { Transaction, TransactionData } from 'EmerisTransactions';
export type AbstractTx = Transaction<TransactionData>;
export type AbstractTxResult = Record<string, unknown>;
