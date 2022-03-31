import { EmerisAPI, EmerisBase } from "@emeris/types";
import axios from 'axios';
// @ts-ignore
import adapter from '@vespaiach/axios-fetch-adapter';
import { AxiosResponse } from 'axios';

export default class ChainConfig {
	private endpoint:string;
	constructor(endpoint:string) {
		this.endpoint = endpoint;
	}
	async getChains(): Promise<EmerisAPI.Chain[]> {
		try {			
			const chainsResult:AxiosResponse<EmerisAPI.ChainsResponse> = await axios.get(this.endpoint+'/chains', { adapter });
			const chains = await Promise.all(chainsResult.data.chains.map(async (chain) => await this.getChain(chain.chain_name)));
			return chains;
		}catch(e) {
			throw new Error("Could not get chains information: "+ e);
		}
	}
	async getChain(chain_name:string):Promise<EmerisAPI.Chain>  {
		try {			
			const result:AxiosResponse<EmerisAPI.ChainResponse> = await axios.get(this.endpoint+'/chain/'+chain_name, { adapter });
			return result.data?.chain ?? null;
		}catch(e) {
			throw new Error("Could not get chain information: "+ e);
		}
	}
	async getChainId(chain_name: string): Promise<string | null> {
		try {
			const chain = await this.getChain(chain_name);
			return chain?.node_info?.chain_id ?? null;
		}catch(e) {
			throw new Error("Could not get chain information: "+ e);
		}
	}
	async getChainType(chain_name: string): Promise<EmerisBase.ChainType> {
		try {
			const chain = await this.getChain(chain_name);
			// TODO: move chain config to CNS
			//return chain.chain_type; 

			// following is a mocked result for now
			return EmerisBase.ChainType.cosmos;
		}catch(e) {
			throw new Error("Could not get chain information: "+ e);
		}
	}
	async getChainLibrary(chain_name: string): Promise<EmerisBase.ChainLibraries> {
		try {
			const chain = await this.getChain(chain_name);
			// TODO: move chain config to CNS
			//return chain.chain_library; 
			
			// following is a mocked result for now
			return EmerisBase.ChainLibraries.cosmjs;
		}catch(e) {
			throw new Error("Could not get chain information: "+ e);
		}
	}
	async getNumbers(chain_name:string, key_hash: string): Promise<EmerisAPI.SeqNumber> {
		try {
			const result: AxiosResponse<{ numbers: EmerisAPI.SeqNumber }> = await axios.get(
				this.endpoint+ '/chain/' + chain_name + '/numbers/' + key_hash, { adapter }
			)
			return result.data?.numbers ?? null
		} catch (e) {
			throw new Error('Could not get account numbers' + e);
		}
	}
	async getFee(tx: Uint8Array, chain_name: string): Promise<unknown> {
		try {
			const result: AxiosResponse<unknown> = await axios.post(this.endpoint+ '/tx/' + chain_name + '/simulate', { tx_bytes: Buffer.from(tx).toString('base64') }, { adapter });
			return result.data ?? null;
		} catch (e) {
			throw "Could not get account numbers";
		}
	}
}