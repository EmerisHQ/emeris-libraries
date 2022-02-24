import axios  from 'axios';
import { AxiosResponse } from 'axios';
import { EmerisAPI } from '@emeris/types'

export async function getChain(chain_name):Promise<EmerisAPI.APIChain>  {
  try {
    const result: AxiosResponse<EmerisAPI.ChainResponse> = await axios.get('https://api.emeris.com/v1/chain/' + chain_name)
    return result.data?.chain ?? null;
  }catch(e) {
    throw "Could not get chain information";
  }
}

export async function getNumbers(chain_name:string, key_hash: string): Promise<EmerisAPI.SeqNumber> {
  try {
    const result: AxiosResponse<{ numbers: EmerisAPI.SeqNumber }> = await axios.get(
      'https://api.emeris.com/v1/chain/' + chain_name + '/numbers/' + key_hash,
    )
    return result.data?.numbers ?? null
  } catch (e) {
    throw 'Could not get account numbers' + e
  }
}
export async function getFee(tx:Uint8Array,chain_name:string):Promise<unknown>  {
  try {
    const result:AxiosResponse<unknown> = await axios.post('https://api.emeris.com/v1/tx/'+chain_name+'/simulate',{tx_bytes:  Buffer.from(tx).toString('base64')});
    return result.data ?? null;
  }catch(e) {
    throw "Could not get account numbers";
  }
}