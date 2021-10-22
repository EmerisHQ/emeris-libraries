import { ProxyEmeris } from "@/lib/ProxyEmeris";


export async function init(emeris:ProxyEmeris):Promise<void> {
  
  let status = await emeris.init();
  if (status) {
    const {
      loaded,
      getAddress,
      getPublicKey,
      isHWWallet,
      supportedChains,
      getWalletName,
      hasWallet,      
      //signTransaction,
      //signAndBroadcastTransaction,
    } = emeris;
    window.emeris = {
      loaded,
      getAddress: getAddress.bind(emeris),
      getPublicKey: getPublicKey.bind(emeris),
      isHWWallet: isHWWallet.bind(emeris),
      supportedChains: supportedChains.bind(emeris),
      getWalletName: getWalletName.bind(emeris),
      hasWallet: hasWallet.bind(emeris),
      //signTransaction,
      //signAndBroadcastTransaction,
    };
  } else {
    window.emeris = { loaded: false };
  }
}
