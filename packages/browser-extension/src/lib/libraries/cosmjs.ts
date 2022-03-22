import { SigningStargateClient, StdFee } from '@cosmjs/stargate';
import { ChainDetails, EmerisAccount } from '@@/types';
import EmerisSigner from '@emeris/signer/lib/EmerisSigner';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoMsg } from '@cosmjs/stargate/node_modules/@cosmjs/amino';
import { bech32 } from 'bech32';

export function chainAddressfromKeyHash(prefix: string, keyHash: string) {
  return bech32.encode(prefix, bech32.toWords(Buffer.from(keyHash, 'hex')))
}

const getHdPath = (chainConfig, account) => {
  let hdPath = chainConfig.HDPath
  if (account.hdPath) {
    hdPath = chainConfig.HDPath.split('/').slice(0, 3).concat(account.hdPath).join('/')
  }
  return hdPath
}

const helpers = {
  getAddress: async (account: EmerisAccount, chainConfig: ChainDetails): Promise<string> => {
    if (account.isLedger) {
      return chainAddressfromKeyHash(chainConfig.prefix, account.keyHash)
    } else {
      const signer = EmerisSigner.withMnemonic(getHdPath(chainConfig, account), account.accountMnemonic)
      return signer.getAddress(chainConfig.chainName);
    }
  },
  getPublicKey: async (
    account: EmerisAccount, chainConfig: ChainDetails
  ): Promise<Uint8Array> => {
    const signer = EmerisSigner.withMnemonic(getHdPath(chainConfig, account), account.accountMnemonic)
    return signer.getPubkey(chainConfig.chainName);
  },
  async sign(
    account: EmerisAccount, chainConfig: ChainDetails, messages: EncodeObject[] | AminoMsg[], fee: StdFee, memo: string) {
    try {
      const signer = EmerisSigner.withMnemonic(getHdPath(chainConfig, account), account.accountMnemonic)
      const broadcastable = await signer.signTx({
        msgs: messages,
        fee,
        memo,
        chain_name: chainConfig.chainName
      })
      return broadcastable
    } catch (err) {
      console.error(err)
      return undefined
    }
  },
  async signLedger(
    account: EmerisAccount, chainConfig: ChainDetails, messages: EncodeObject[] | AminoMsg[], fee: StdFee, memo: string) {
    try {
      const signer = EmerisSigner.withLedger(getHdPath(chainConfig, account))
      const broadcastable = await signer.signTx({
        msgs: messages,
        fee,
        memo,
        chain_name: chainConfig.chainName
      })
      return broadcastable
    } catch (err) {
      console.error(err)
      return undefined
    }
  },
  async getRawSignable(
    account: EmerisAccount, chainConfig: ChainDetails, messages, fee, memo): Promise<any> {
    try {
      const signer = EmerisSigner.withMnemonic(getHdPath(chainConfig, account), account.accountMnemonic)
      const rawTx = await signer.getRawTX({
        msgs: messages,
        fee,
        memo,
        chain_name: chainConfig.chainName
      })

      return rawTx
    } catch (err) {
      console.error(err)
      return undefined
    }
  },
  async signAndBroadcast(account: EmerisAccount, chainConfig: ChainDetails, messages, fee, memo) {
    try {
      const client = await SigningStargateClient.connect(
        chainConfig.rpcEndpoint
      );

      const broadcastable = await this.sign(account, chainConfig, messages, fee, memo)

      const response = await client.broadcastTx(broadcastable)
      return response
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
};
export default helpers;
