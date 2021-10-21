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