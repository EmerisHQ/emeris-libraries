import { getCosmosClient } from "./modules/cosmos";
import { EmerisSigningClient } from "./modules/cosmos/emerisSigningClient";
import { isCosmos } from "./type-guards";
import { SignerRequest } from "./types/requests";

export default class EmerisSigner {
  private mnemonic: string;
  private isLedger: boolean;

  constructor(isLedger=false,mnemonic?:string) {
    if (!isLedger) {
      this.mnemonic=mnemonic;
    }
    this.isLedger=isLedger;
  }
  public static withLedger() {
    return new EmerisSigner(true);
  }
  public static withMnemonic(mnemonic: string) {
    return new EmerisSigner(false, mnemonic);
  }
  async signTx(tx: SignerRequest): Promise<Uint8Array> {
    if (isCosmos(tx)) {
      const client:EmerisSigningClient = await getCosmosClient(tx.chain_name, this.isLedger, this.mnemonic);
      return await client.signTx(tx.msgs,tx.fee,tx.memo);
    }
  }
  async getFees(tx: SignerRequest): Promise<unknown> {
    if (isCosmos(tx)) {
      const client:EmerisSigningClient = await getCosmosClient(tx.chain_name, this.isLedger, this.mnemonic);
      return await client.getFees(tx.msgs,tx.memo);
    }
  }
  async getRawTX(tx: SignerRequest): Promise<unknown> {
    if (isCosmos(tx)) {
      const client:EmerisSigningClient = await getCosmosClient(tx.chain_name, this.isLedger, this.mnemonic);
      return await client.getRawTX(tx.msgs,tx.fee,tx.memo);
    }
  }
}
