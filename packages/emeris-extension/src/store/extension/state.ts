import { EmerisWallet, ExtensionRequest } from '@/types';

export type State = {
  pending: Array<ExtensionRequest>;
  wallet: EmerisWallet
};
export function getDefaultState(): State {
  return {
    pending: [],
    wallet: null
  };
}
