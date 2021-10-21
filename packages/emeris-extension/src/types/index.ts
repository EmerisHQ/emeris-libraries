export type EmerisEncryptedWallet = {
  walletName: string;
  walletData: string;
};
export type EmerisWallet = {
  walletName: string;
  walletMnemonic: string;
  lastUsedChain?: string;
};
