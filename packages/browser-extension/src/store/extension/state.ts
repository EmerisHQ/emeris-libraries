import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types';

export type State = {
  pending: Array<ExtensionRequest>;
  wallet: EmerisWallet;
  wallets: EmerisEncryptedWallet[];
};
export function getDefaultState(): State {
  return {
    pending: [],
    wallet: null,
    wallets: [],
  };
}
