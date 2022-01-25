import { EmerisAccount, EmerisWallet, ExtensionRequest } from '@@/types';

export type State = {
  pending: Array<ExtensionRequest>;
  wallet: EmerisWallet;
  lastAccount: string;
  newAccount: EmerisAccount;
  whitelistedWebsites: { origin: string }[];
};
export function getDefaultState(): State {
  return {
    pending: [],
    wallet: null,
    lastAccount: null,
    newAccount: null,
    whitelistedWebsites: [],
  };
}
