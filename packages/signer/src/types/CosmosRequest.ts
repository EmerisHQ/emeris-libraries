import { EncodeObject } from '@cosmjs/proto-signing';  
import { AminoMsg, StdFee } from '@cosmjs/amino';
import { BaseRequest } from './BaseRequest';

export type CosmosRequest = {
	msgs: EncodeObject[] | AminoMsg[];
	memo?: string;
	fee?: StdFee;
} & BaseRequest;