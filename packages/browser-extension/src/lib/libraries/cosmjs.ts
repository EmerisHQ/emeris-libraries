import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';

const helpers = {
  getAddress: async (mnemonic: string, { HDPath, prefix }: { HDPath?: string; prefix?: string }): Promise<string> => {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix, hdPaths: [stringToPath(HDPath)] });
    const [account] = await signer.getAccounts();
    return account.address;
  },
  getPublicKey: async (
    mnemonic: string,
    { HDPath, prefix }: { HDPath?: string; prefix?: string },
  ): Promise<Uint8Array> => {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix, hdPaths: [stringToPath(HDPath)] });
    const [account] = await signer.getAccounts();
    return account.pubkey;
  },
};
export default helpers;
