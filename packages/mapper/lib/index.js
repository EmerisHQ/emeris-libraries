"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmerisMessageMapper_1 = require("./EmerisMessageMapper");
async function map(req) {
    const chainName = req.chainName;
    const signingAddress = req.signingAddress;
    const mapped = req.txs.map(async (tx) => {
        (await EmerisMessageMapper_1.EmerisMessageMapper.fromChainProtocol(chainName, tx.protocol)).map(tx, signingAddress);
    });
}
exports.default = map;
async function test() {
    console.log(await EmerisMessageMapper_1.EmerisMessageMapper.fromChainProtocol('cosmos'));
}
test();
