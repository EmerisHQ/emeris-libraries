import { ChainClient } from "./types/common";
import { getCosmosSigningClient, getTerraSigningClient } from "./clients";
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { keyHash } from "./utils";
import { getNumbers } from "./api";
import { EmerisChainNumber } from "./types/api";
import { SigningStargateClient } from "@cosmjs/stargate";
import { StdFee as CosmjsFee} from "@cosmjs/amino";
import { CosmosTX } from "./types/transactions";

export default class EmerisSigner {
  public signer: string;
  public chain_name: string;
  public chain_id: string;
  public client: ChainClient;
  public gas: number;

  constructor(chain_name, chain_id, signer, gas) {
    this.chain_name = chain_name;
    this.chain_id = chain_id;
    this.signer = signer;
    this.gas = gas;
  }
  async init() {
    try {
      switch (this.chain_name) {
        case "cosmos-hub":
        case "akash":
        case "iris":
        case "regen":
        case "osmosis":
        case "sentinel":
        case "crypto-org":
        case "crypto-com":
        case "persistence":
        case "ixo":
        case "starname":
        case "microtick":
        case "emoney":
        case "terra":
          this.client = await getCosmosSigningClient(this.chain_name);
          break;
      }
    } catch (e) {
      throw "Emeris signer failed to initialize";
    }
  }
  async sign(tx_data) {
    switch (this.chain_name) {
        case "cosmos-hub":
        case "akash":
        case "iris":
        case "regen":
        case "osmosis":
        case "sentinel":
        case "crypto-org":
        case "crypto-com":
        case "persistence":
        case "ixo":
        case "starname":
        case "microtick":
        case "emoney":
        case "terra":
          return this.cosmosSign(tx_data as CosmosTX);
    }
  }
  async cosmosSign(tx_data:CosmosTX):Promise<Uint8Array> {
    let numbers: EmerisChainNumber;
    try {
      numbers = (await getNumbers(keyHash(this.signer))).find(
        (x) => (x.chain_name = this.chain_name)
      );
    } catch (e) {
      throw "Could not retrieve sequence number";
    }
    const fee: CosmjsFee = {
      amount: [{
        amount: tx_data.fees.amount.toString(),
        denom: tx_data.fees.denom
      }],
        gas: this.gas.toString()
    }
    const tx = await (this.client as SigningStargateClient).sign(this.signer, tx_data.msgs, fee, tx_data.memo, {
      accountNumber: numbers.account_number,
      sequence: numbers.sequence_number,
      chainId: this.chain_id,
    });
    
    const enc = TxRaw.encode(tx);
    const dec = TxRaw.encode(TxRaw.decode(enc.finish())).finish();
    return dec;
  }
}
