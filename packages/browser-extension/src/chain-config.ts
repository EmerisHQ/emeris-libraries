import { ChainDetails } from './types';
import mappers from '@@/../../mapper/src';

const chainConfig = {
  'cosmos-hub': {
    library: 'CosmJS',
    HDPath: "m/44'/118'/0'/0/0",
    prefix: 'cosmos',
    mapper: mappers.CosmosAminoMessageMapper,
    rpcEndpoint: 'https://rpc.cosmos.network:443',
    chainId: 'cosmos-hub-4'
  },
} as Record<string, ChainDetails>;
export default chainConfig;
