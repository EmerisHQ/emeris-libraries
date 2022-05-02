import {
  AminoMsg,
  encodeSecp256k1Pubkey,
  makeSignDoc as makeSignDocAmino,
  OfflineAminoSigner,
  StdFee,
  StdSignDoc,
} from '@cosmjs/amino'
import { fromBase64 } from '@cosmjs/encoding'
import { Int53 } from '@cosmjs/math'
import { EncodeObject, encodePubkey, makeAuthInfoBytes, TxBodyEncodeObject } from '@cosmjs/proto-signing'
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing'
import { AminoConverters, AminoTypes } from '@cosmjs/stargate';
import { SigningStargateClient } from '@cosmjs/stargate'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { EmerisSigningClient } from './emerisSigningClient'
import { osmosisTypes } from './osmosisTypes'
import ChainConfig from '@emeris/chain-config'
import { keyHash } from '../../utils'
import { bech32 } from 'bech32';
import {
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFreegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
} from '@cosmjs/stargate';

function isAmino(obj: unknown): obj is AminoMsg[] {
  return obj[0].type !== undefined
}
function isProto(obj: unknown): obj is EncodeObject[] {
  return obj[0].typeUrl !== undefined
}

function createAminoTypes(prefix: string): AminoConverters {
  return {
    ...createAuthzAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(prefix),
    ...createIbcAminoConverters(),
    ...createFreegrantAminoConverters(),
    ...osmosisTypes
  };
}
export default class OsmosisSigningClient extends SigningStargateClient implements EmerisSigningClient {
  exposedSigner: OfflineAminoSigner
  chain_name: string
  chainConfig: ChainConfig

  constructor(...args) {
    super(args[0], args[1], args[2])
    this.exposedSigner = args[1]
    this.chain_name = args[3]
    this.chainConfig = new ChainConfig(process.env.EMERIS_ENDPOINT || 'https://api.emeris.com/v1')
  }

  private async setupSigner() {
    const accountFromSigner = (await this.exposedSigner.getAccounts())[0]
    const signerAddress = accountFromSigner.address
    const aminoTypes = new AminoTypes({ ...createAminoTypes(bech32.decode(signerAddress).prefix) });
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey))
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    const chain_id = await this.chainConfig.getChainId(this.chain_name)
    const { sequence_number, account_number } = await this.chainConfig.getNumbers(
      this.chain_name,
      keyHash(signerAddress),
    )
    return { aminoTypes, signerAddress, pubkey, signMode, chain_id, sequence_number, account_number }
  }
  private mapMessages(messages: readonly AminoMsg[] | readonly EncodeObject[], aminoTypes: AminoTypes): {
    aminomsgs: readonly AminoMsg[]
    protomsgs: readonly EncodeObject[]
  } {
    let protomsgs: EncodeObject[]
    let aminomsgs: AminoMsg[]

    if (isAmino(messages)) {
      aminomsgs = messages
      protomsgs = messages.map((x) => aminoTypes.fromAmino(x))
    }
    if (isProto(messages)) {
      aminomsgs = messages.map((x) => aminoTypes.toAmino(x))
      protomsgs = messages
    }
    return { aminomsgs, protomsgs }
  }
  private finalizeTx(txRaw: TxRaw): Uint8Array {
    const enc = TxRaw.encode(txRaw)
    return TxRaw.encode(TxRaw.decode(enc.finish())).finish()
  }

  async getSignature(
    messages: readonly AminoMsg[] | readonly EncodeObject[],
    fee: StdFee,
    memo: string,) {
    const { aminoTypes, signerAddress, chain_id, sequence_number, account_number } =
      await this.setupSigner()

    const { aminomsgs } = this.mapMessages(messages, aminoTypes)

    const signDoc = makeSignDocAmino(aminomsgs, fee, chain_id, memo, account_number, sequence_number)
    const { signature, signed } = await this.exposedSigner.signAmino(signerAddress, signDoc)

    return { signature, signed }
  }

  async signTx(
    messages: readonly AminoMsg[] | readonly EncodeObject[],
    fee: StdFee,
    memo: string,
  ): Promise<Uint8Array> {
    const { aminoTypes, pubkey, signMode } =
      await this.setupSigner()

    const { signature, signed } = await this.getSignature(messages, fee, memo)
    const signedTxBody = {
      messages: signed.msgs.map((msg) => aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    }
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    }
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject)
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber()
    const sequence = Int53.fromString(signed.sequence).toNumber()
    const signedAuthInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], signed.fee.amount, signedGasLimit, signMode)
    const txRaw: TxRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    })

    return this.finalizeTx(txRaw)
  }

  async getFees(messages: readonly AminoMsg[] | EncodeObject[], memo: string): Promise<StdFee> {
    const { pubkey, signMode, sequence_number, aminoTypes } = await this.setupSigner()
    const { protomsgs } = this.mapMessages(messages, aminoTypes)

    const fee = { amount: [], gas: '1000000' }

    const signedTxBody = {
      messages: protomsgs,
      memo: memo,
    }

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    }
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject)
    const signedGasLimit = Int53.fromString(fee.gas).toNumber()
    const sequence = sequence_number
    const signedAuthInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], fee.amount, signedGasLimit, signMode)
    const txRaw: TxRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [new Uint8Array([1, 2, 3])],
    })

    const dec = this.finalizeTx(txRaw)
    const stdfee = await this.chainConfig.getFee(dec, this.chain_name)
    return stdfee as StdFee
  }

  async getRawTX(messages: readonly AminoMsg[] | EncodeObject[], fee: StdFee, memo: string): Promise<StdSignDoc> {
    const { chain_id, sequence_number, account_number, aminoTypes } = await this.setupSigner()
    const { aminomsgs } = this.mapMessages(messages, aminoTypes)
    return makeSignDocAmino(aminomsgs, fee, chain_id, memo, account_number, sequence_number)
  }
}
