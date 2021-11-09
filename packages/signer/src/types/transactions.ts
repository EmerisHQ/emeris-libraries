import { EncodeObject } from '@cosmjs/proto-signing';

import { EmerisAmount } from './common';

export type CosmosTX = {
	msgs: Array<EncodeObject>;
	fees: EmerisAmount;
	memo?: string;
}