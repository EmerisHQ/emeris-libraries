import { Secp256k1HdWallet, encodeSecp256k1Pubkey } from '@cosmjs/amino';
import { stringToPath } from '@cosmjs/crypto';
import { Int53 } from '@cosmjs/math';
import { makeStdTx } from '@cosmjs/launchpad';
import { fromBase64 } from '@cosmjs/encoding';
import { SigningStargateClient } from '@cosmjs/stargate';
import { ChainDetails, EmerisAccount } from '@@/types';
import { makeSignDoc } from '@cosmjs/proto-signing/node_modules/@cosmjs/amino';
import { encodePubkey, makeAuthInfoBytes } from '@cosmjs/proto-signing';
import { TxRaw } from '@cosmjs/proto-signing/build/codec/cosmos/tx/v1beta1/tx';
import { SignMode } from '@cosmjs/proto-signing/build/codec/cosmos/tx/signing/v1beta1/signing';

const getHdPath = (chainConfig, account) => {
  let hdPath = chainConfig.HDPath
  if (account.hdPath) {
    hdPath = chainConfig.HDPath.split('/').slice(0, 2).concat(account.hdPath).join('/')
  }
  return hdPath
}

const helpers = {
  getSigner: async (account: EmerisAccount, chainConfig: ChainDetails): Promise<Secp256k1HdWallet> => {
    // @ts-ignore
    const signer = await Secp256k1HdWallet.fromMnemonic(account.accountMnemonic, { prefix: chainConfig.prefix, hdPaths: [stringToPath(getHdPath(chainConfig, account))] });
    return signer;
  },
  getAddress: async (account: EmerisAccount, chainConfig: ChainDetails): Promise<string> => {
    const signer = await helpers.getSigner(account, chainConfig)
    const [signerAccount] = await signer.getAccounts();
    return signerAccount.address;
  },
  getPublicKey: async (
    account: EmerisAccount, chainConfig: ChainDetails
  ): Promise<Uint8Array> => {
    const signer = await helpers.getSigner(account, chainConfig)
    const [signerAccount] = await signer.getAccounts();
    return signerAccount.pubkey;
  },
  async sign(
    account: EmerisAccount, chainConfig: ChainDetails, messages, fee, memo) {
    try {
      const signer = await helpers.getSigner(account, chainConfig)
      const [signerAccount] = await signer.getAccounts();

      const client = await SigningStargateClient.connectWithSigner(
        chainConfig.rpcEndpoint,
        signer
      );

      const { accountNumber, sequence } = await client.getSequence(signerAccount.address);
      const chainId = await client.getChainId();
      const signDoc = makeSignDoc(messages, fee, chainId, memo, accountNumber, sequence);

      const { signed, signature } = await signer.signAmino(signerAccount.address, signDoc);
      const signedTxBody = {
        // @ts-ignore
        messages: signed.msgs.map((msg) => client.aminoTypes.fromAmino(msg)),
        memo: signed.memo,
      };
      const signedTxBodyEncodeObject = {
        typeUrl: "/cosmos.tx.v1beta1.TxBody",
        value: signedTxBody,
      };
      const signedTxBodyBytes = client.registry.encode(signedTxBodyEncodeObject);
      const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
      const signedSequence = Int53.fromString(signed.sequence).toNumber();
      const pubkey = encodePubkey(encodeSecp256k1Pubkey(signerAccount.pubkey));
      const signedAuthInfoBytes = makeAuthInfoBytes([pubkey], signed.fee.amount, signedGasLimit, signedSequence, SignMode.SIGN_MODE_LEGACY_AMINO_JSON);
      const txRaw = TxRaw.fromPartial({
        bodyBytes: signedTxBodyBytes,
        authInfoBytes: signedAuthInfoBytes,
        signatures: [fromBase64(signature.signature)],
      });
      const txBytes = TxRaw.encode(txRaw).finish();
      return txBytes
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
};
export default helpers;
