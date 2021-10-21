export type EmerisEncryptedWallet = {
  walletName: string;
  walletData: string;
};
export type EmerisWallet = {
  walletName: string;
  walletMnemonic: string;
  lastUsedChain?: string;
};
export type ExtensionRequest = {
  id: string;
  [key: string]: unknown;
};
