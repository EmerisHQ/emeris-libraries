import { EmerisAPI, EmerisBase } from "@emeris/types";
import 'isomorphic-fetch';


export default class ChainConfig {
	private endpoint:string;
	constructor(endpoint:string) {
		this.endpoint = endpoint;
	}
	async getChains(): Promise<EmerisAPI.Chain[]> {
		try {			
			const chainsResult:EmerisAPI.ChainsResponse = (await (await fetch(this.endpoint+'/chains')).json());
			const chains = await Promise.all(chainsResult.chains.map(async (chain) => await this.getChain(chain.chain_name)));
			return chains;
		}catch(e) {
			throw new Error("Could not get chains information: "+ e);
		}
	}
	async getChain(chain_name:string):Promise<EmerisAPI.Chain>  {
		try {			
			const result:EmerisAPI.ChainResponse = (await (await fetch(this.endpoint+'/chain/'+chain_name)).json());
			return result.chain ?? null;
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
			const result:{ numbers: EmerisAPI.SeqNumber } = (await (await fetch(
				this.endpoint+ '/chain/' + chain_name + '/numbers/' + key_hash)).json());
			return result.numbers ?? null
		} catch (e) {
			throw new Error('Could not get account numbers' + e);
		}
	}
	async getFee(tx: Uint8Array, chain_name: string): Promise<unknown> {
		try {
			const result:unknown = (await (await fetch(this.endpoint+ '/tx/' + chain_name + '/simulate', 
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ tx_bytes: Buffer.from(tx).toString('base64') })
			})).json());
			return result ?? null;
		} catch (e) {
			throw "Could not get account numbers";
		}
	}
}