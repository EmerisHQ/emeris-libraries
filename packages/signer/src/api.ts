import axios  from 'axios';
import { AxiosResponse}  from 'axios';
import { EmerisChain, EmerisChainResponse, EmerisNumbers, EmerisNumbersResponse } from './types/api';

export async function getChain(chain_name):Promise<EmerisChain>  {
  try {
    const result:AxiosResponse<EmerisChainResponse> = await axios.get('https://staging.demeris.io/v1/chain/'+chain_name);
    return result.data?.chain ?? null;
  }catch(e) {
    throw "Could not get chain information";
  }
}

export async function getNumbers(key_hash:string):Promise<EmerisNumbers>  {
  try {
    const result:AxiosResponse<EmerisNumbersResponse> = await axios.get('https://dev.demeris.io/v1/account/'+key_hash+'/numbers');
    return result.data?.numbers ?? null;
  }catch(e) {
    throw "Could not get account numbers";
  }
}
export async function getFee(tx:Uint8Array,chain_name:string):Promise<unknown>  {
  try {
    const result:AxiosResponse<unknown> = await axios.post('https://dev.demeris.io/v1/tx/'+chain_name+'/simulate',{tx_bytes:  Buffer.from(tx).toString('base64')});
    return result.data ?? null;
  }catch(e) {
    throw "Could not get account numbers";
  }
}