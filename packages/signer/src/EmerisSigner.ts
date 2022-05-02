import { AminoSignResponse } from '@cosmjs/amino'
import { getCosmosClient } from './modules/cosmos'
import { EmerisSigningClient } from './modules/cosmos/emerisSigningClient'
import { isCosmos } from './type-guards'
import { SignerRequest } from './types/requests'

export default class EmerisSigner {
  private mnemonic: string
  private isLedger: boolean
  private HdPath: string

  constructor(isLedger = false, HdPath: string, mnemonic?: string) {
    if (!isLedger) {
      this.mnemonic = mnemonic
    }
    this.HdPath = HdPath
    this.isLedger = isLedger
  }
  public static withLedger(HdPath: string) {
    return new EmerisSigner(true, HdPath)
  }
  public static withMnemonic(HdPath: string, mnemonic: string) {
    return new EmerisSigner(false, HdPath, mnemonic)
  }
  async getSignature(tx: SignerRequest): Promise<AminoSignResponse> {
    const client: EmerisSigningClient = await getCosmosClient(
      tx.chain_name,
      this.isLedger,
      this.mnemonic,
      this.HdPath,
    )
    return await client.getSignature(tx.msgs, tx.fee, tx.memo)
  }
  async signTx(tx: SignerRequest): Promise<Uint8Array> {
    if (isCosmos(tx)) {
      const client: EmerisSigningClient = await getCosmosClient(
        tx.chain_name,
        this.isLedger,
        this.mnemonic,
        this.HdPath,
      )
      return await client.signTx(tx.msgs, tx.fee, tx.memo)
    }
  }
  async getFees(tx: SignerRequest): Promise<unknown> {
    if (isCosmos(tx)) {
      const client: EmerisSigningClient = await getCosmosClient(
        tx.chain_name,
        this.isLedger,
        this.mnemonic,
        this.HdPath,
      )
      return await client.getFees(tx.msgs, tx.memo)
    }
  }
  async getRawTX(tx: SignerRequest): Promise<unknown> {
    if (isCosmos(tx)) {
      const client: EmerisSigningClient = await getCosmosClient(
        tx.chain_name,
        this.isLedger,
        this.mnemonic,
        this.HdPath,
      )
      return await client.getRawTX(tx.msgs, tx.fee, tx.memo)
    }
  }
  private async getSignerAccount(chain_name: string) {
    // @ts-ignore
    if (isCosmos({
      chain_name
    })) {
      const client: EmerisSigningClient = await getCosmosClient(chain_name, false, this.mnemonic, this.HdPath);
      const [signerAccount] = await client.exposedSigner.getAccounts()
      return signerAccount;
    }
  }
  async getAddress(chain_name: string): Promise<string> {
    return (await this.getSignerAccount(chain_name)).address
  }
  async getPubkey(chain_name: string): Promise<Uint8Array> {
    return (await this.getSignerAccount(chain_name)).pubkey
  }
}