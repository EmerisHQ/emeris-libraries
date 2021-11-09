import { ChainDetails } from './types';

const chainConfig = {
  'cosmoshub-4': {
    library: 'CosmJS',
    HDPath: "m/44'/118'/0'/0/0",
    prefix: 'cosmos',
  },
} as Record<string, ChainDetails>;
export default chainConfig;
