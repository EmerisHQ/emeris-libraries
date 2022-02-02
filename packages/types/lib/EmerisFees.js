"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeesResponse = exports.FeesRequest = void 0;
const typebox_1 = require("@sinclair/typebox");
const Coin = typebox_1.Type.Strict(typebox_1.Type.Object({
    denom: typebox_1.Type.String(),
    amount: typebox_1.Type.String()
}));
exports.FeesRequest = typebox_1.Type.Strict(typebox_1.Type.Object({
    tx: typebox_1.Type.Any(),
}));
exports.FeesResponse = typebox_1.Type.Strict(typebox_1.Type.Object({
    GasWanted: typebox_1.Type.String(),
    GasUsed: typebox_1.Type.String(),
    Fees: typebox_1.Type.Array(Coin)
}));
