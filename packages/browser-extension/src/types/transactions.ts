import { Transaction, TransactionData } from '../../../types/lib/EmerisTransactions';
export type AbstractTx = Transaction<TransactionData>;
export type AbstractTxResult = Record<string, unknown>;
