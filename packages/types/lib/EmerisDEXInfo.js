"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapsResponse = exports.Swaps = exports.Swap = exports.SwapType = exports.DEX = exports.Denom = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.Denom = typebox_1.Type.Strict(typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    displayName: typebox_1.Type.String(),
    denom: typebox_1.Type.String(),
    baseDenom: typebox_1.Type.String(),
    precision: typebox_1.Type.Number()
}));
var DEX;
(function (DEX) {
    DEX["Gravity"] = "gravity";
    DEX["Osmosis"] = "osmosis";
    DEX["Sifchain"] = "sifchain";
})(DEX = exports.DEX || (exports.DEX = {}));
var SwapType;
(function (SwapType) {
    SwapType["Pool"] = "pool";
    SwapType["Swap"] = "swap";
})(SwapType = exports.SwapType || (exports.SwapType = {}));
exports.Swap = typebox_1.Type.Strict(typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    id: typebox_1.Type.String(),
    chainId: typebox_1.Type.String(),
    protocol: typebox_1.Type.Enum(DEX),
    denomA: exports.Denom,
    denomB: exports.Denom,
    swapPrice: typebox_1.Type.String(),
    swapType: typebox_1.Type.Enum(SwapType)
}));
exports.Swaps = typebox_1.Type.Array(exports.Swap);
exports.SwapsResponse = typebox_1.Type.Strict(typebox_1.Type.Object({
    swaps: exports.Swaps
}));
