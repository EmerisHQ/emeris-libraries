import { ChainDetails } from './types';

const chainConfigList = [{
  library: 'CosmJS',
  HDPath: "m/44'/118'/0'/0/0",
  prefix: 'cosmos',
  rpcEndpoint: 'https://rpc.cosmos.network:443',
  chainId: 'cosmoshub-4',
  chainName: 'cosmos-hub',
}]
const chainConfig = Object.fromEntries(chainConfigList.map(config => [config.chainName, config])) as Record<string, ChainDetails>;
export default chainConfig;
