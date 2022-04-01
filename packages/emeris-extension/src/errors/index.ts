export class WalletNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, WalletNotFoundError.prototype);
  }
}
export class SaveWalletError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, SaveWalletError.prototype);
  }
}
export class UnlockWalletError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, UnlockWalletError.prototype);
  }
}
