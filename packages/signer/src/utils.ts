import { bech32 } from 'bech32';

function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
}

export function keyHash(address: string): string {
  try {
    return toHexString(bech32.fromWords(bech32.decode(address).words));
  } catch (e) {
    throw new Error('Could not decode address');
  }
}