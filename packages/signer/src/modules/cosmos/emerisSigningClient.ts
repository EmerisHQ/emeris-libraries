import { OfflineAminoSigner, StdFee, AminoMsg,StdSignDoc } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';

export interface EmerisSigningClient {
  exposedSigner: OfflineAminoSigner;
  signTx: (messages: readonly AminoMsg[] | readonly EncodeObject[],
    fee: StdFee,
    memo: string)  => Promise<Uint8Array>;
  getFees: (messages: readonly AminoMsg[] | EncodeObject[],
    memo: string)  => Promise<StdFee>;
  getRawTX: (messages: readonly AminoMsg[] | EncodeObject[],
      fee: StdFee,
      memo: string)  => Promise<StdSignDoc>;
}