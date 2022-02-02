  
import { AminoMsg, encodeSecp256k1Pubkey, makeSignDoc as makeSignDocAmino, OfflineAminoSigner, StdFee, StdSignDoc } from '@cosmjs/amino';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import { EncodeObject, encodePubkey, makeAuthInfoBytes, TxBodyEncodeObject } from '@cosmjs/proto-signing';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { AminoTypes } from '@cosmjs/stargate';
import {  SigningStargateClient } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { EmerisSigningClient } from './emerisSigningClient';
import { getFee, getNumbers,getChain } from '../../api';
import { keyHash } from '../../utils';

function isAmino(obj: unknown): obj is AminoMsg[] {
  return obj[0].type!==undefined
}
function isProto(obj: unknown): obj is EncodeObject[] {
  return obj[0].typeUrl!==undefined
}
export default class GravitySigningClient extends SigningStargateClient implements EmerisSigningClient {
  
  exposedSigner: OfflineAminoSigner;
  chain_name: string;

  constructor(...args) {
    super(args[0], args[1], args[2]);
    this.exposedSigner = args[1];
    this.chain_name = args[3];
  }
  async signTx( messages: readonly AminoMsg[] | readonly EncodeObject[], fee:StdFee, memo:string ): Promise<Uint8Array> {
    
    const accountFromSigner = (await this.exposedSigner.getAccounts())[0];
    const signerAddress = accountFromSigner.address;
    const aminoTypes = new AminoTypes();
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    
    const chain_id =  (await getChain(this.chain_name)).node_info.chain_id;
    const { sequence_number, account_number} = (await getNumbers(keyHash(signerAddress))).find(
      (x) => (x.chain_name ==this.chain_name)
    );
    let aminomsgs:AminoMsg[];

    if (isAmino(messages)) {
      aminomsgs=messages;
    }
    if (isProto(messages)) {
      aminomsgs=messages.map(x => aminoTypes.toAmino(x));
    }

    const signDoc = makeSignDocAmino(aminomsgs, fee, chain_id, memo, account_number, sequence_number);
    const { signature, signed } = await this.exposedSigner.signAmino(signerAddress, signDoc);
    const signedTxBody = {
      messages: signed.msgs.map((msg) => aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const sequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{pubkey, sequence}],
      signed.fee.amount,
      signedGasLimit,
      signMode,
    );
    const txRaw: TxRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });

    const enc = TxRaw.encode(txRaw);
    const dec = TxRaw.encode(TxRaw.decode(enc.finish())).finish();
    return dec;
  }
  async getFees( messages: readonly AminoMsg[] | EncodeObject[], memo: string): Promise<StdFee> {

    const accountFromSigner = (await this.exposedSigner.getAccounts())[0];
    const signerAddress = accountFromSigner.address;
    const aminoTypes = new AminoTypes();
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    
    const {sequence_number} = (await getNumbers(keyHash(signerAddress))).find(
      (x) => (x.chain_name ==this.chain_name)
    );
    
    let protomsgs:EncodeObject[];

    if (isAmino(messages)) {    
      protomsgs=messages.map(x => aminoTypes.fromAmino(x));
    }
    if (isProto(messages)) {    
      protomsgs=messages;
    }
    const fee ={amount: [], gas: "1000000"}
    
    const signedTxBody = {
      messages: protomsgs,
      memo: memo,
    };

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(fee.gas).toNumber();
    const sequence = sequence_number;
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{pubkey, sequence}],
      fee.amount,
      signedGasLimit,
      signMode,
    );
    const txRaw: TxRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      // generates a proto-serialized signed TX object (with a dummy signature as it is never checked) because that's what the estimation endpoint expects.
      signatures: [new Uint8Array([1,2,3])],
    });

    const enc = TxRaw.encode(txRaw);
    const dec = TxRaw.encode(TxRaw.decode(enc.finish())).finish();
    const stdfee = await getFee(dec,this.chain_name);
    return stdfee as StdFee;

  }
  async getRawTX( messages: readonly AminoMsg[] | EncodeObject[], fee: StdFee, memo: string ):Promise<StdSignDoc> {

    const accountFromSigner = (await this.exposedSigner.getAccounts())[0];
    const signerAddress = accountFromSigner.address;
    const aminoTypes = new AminoTypes();
    
    const { sequence_number, account_number} = (await getNumbers(keyHash(signerAddress))).find(
      (x) => (x.chain_name ==this.chain_name)
    );
    let aminomsgs:AminoMsg[];    

    if (isAmino(messages)) {
      aminomsgs=messages;
    }
    if (isProto(messages)) {
      aminomsgs=messages.map(x => aminoTypes.toAmino(x));      
    }

    const chain_id =  (await getChain(this.chain_name)).node_info.chain_id;
    const signDoc = makeSignDocAmino(aminomsgs, fee, chain_id, memo, account_number, sequence_number);
    return signDoc;
  }

}