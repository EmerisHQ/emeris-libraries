import { EmerisAPI, EmerisBase } from "@emeris/types";
import axios  from 'axios';
import { AxiosResponse } from 'axios';

export default class ChainConfig {
	private endpoint:string;
	constructor(endpoint:string) {
		this.endpoint = endpoint;
	}
	async getChains(): Promise<EmerisAPI.APIChain[]> {
		try {			
			const chainsResult:AxiosResponse<EmerisAPI.ChainsResponse> = await axios.get(this.endpoint+'/chains');
			const chains = await Promise.all(chainsResult.data.chains.map(async (chain) => await this.getChain(chain.chain_name)));
			return chains;
		}catch(e) {
			throw new Error("Could not get chains information: "+ e);
		}
	}
	async getChain(chain_name:string):Promise<EmerisAPI.APIChain>  {
		try {			
			const result:AxiosResponse<EmerisAPI.ChainResponse> = await axios.get(this.endpoint+'/chain/'+chain_name);
			return result.data?.chain ?? null;
		}catch(e) {
			throw new Error("Could not get chain information: "+ e);
		}
	}
	async getChainId(chain_name: string): Promise<string> {
		try {
			const chain = await this.getChain(chain_name);
			return chain.node_info.chain_id;
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
}