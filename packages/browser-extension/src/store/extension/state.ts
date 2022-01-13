import { EmerisEncryptedWallet, EmerisWallet, ExtensionRequest } from '@@/types';

export type State = {
  pending: Array<ExtensionRequest>;
  wallet: EmerisWallet;
  lastAccount: string;
};
export function getDefaultState(): State {
  return {
    pending: [],
    wallet: null,
    lastAccount: null
  };
}
