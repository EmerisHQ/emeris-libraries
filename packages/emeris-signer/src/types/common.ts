import { SigningStargateClient } from "@cosmjs/stargate";


export type ChainClient = SigningStargateClient;
export type EmerisAmount = {
	amount: number;
	denom: string;
}