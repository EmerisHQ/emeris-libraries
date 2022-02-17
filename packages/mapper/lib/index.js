"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmerisMessageMapper_1 = require("./EmerisMessageMapper");
async function map(req) {
    const chainName = req.chainName;
    const signingAddress = req.signingAddress;
    try {
        const mapped = Promise.all(req.txs.map(async (tx) => {
            (await EmerisMessageMapper_1.EmerisMessageMapper.fromChainProtocol(chainName, tx.protocol)).map(tx, signingAddress);
        }));
        return mapped;
    }
    catch (e) {
        throw (new Error('Could not map txs: ' + e));
    }
}
exports.default = map;
