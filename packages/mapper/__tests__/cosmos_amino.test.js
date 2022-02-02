"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var amino_1 = require("@cosmjs/amino");
var cosmos_amino_1 = require("../src/cosmos_amino");
describe('Cosmos Mapps', function () {
    var mnemonic = "surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put";
    var chainId = "emeris-chain";
    var fee = {
        amount: (0, amino_1.coins)(2000, "ucosm"),
        gas: "180000"
    };
    var firstAccount, mapper, wallet;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, amino_1.Secp256k1HdWallet.fromMnemonic(mnemonic)];
                case 1:
                    wallet = _a.sent();
                    return [4 /*yield*/, wallet.getAccounts()];
                case 2:
                    firstAccount = (_a.sent())[0];
                    mapper = new cosmos_amino_1["default"](chainId);
                    return [2 /*return*/];
            }
        });
    }); });
    it('transfer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgs = mapper.transfer({
                        amount: (0, amino_1.coins)(2000, "ucosm"),
                        to_address: firstAccount.address,
                        chain_name: chainId
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('ibcTransfer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    jest
                        .useFakeTimers('modern')
                        .setSystemTime(new Date('2020-01-01').getTime());
                    msgs = mapper.ibcTransfer({
                        from_chain: chainId,
                        to_chain: "moon",
                        through: "abcdchannel",
                        to_address: firstAccount.address,
                        amount: (0, amino_1.coins)(2000, "ucosm")
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('swap', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgs = mapper.swap({
                        pool: {
                            id: 1,
                            type_id: 1,
                            reserve_coin_denoms: ["sayajin", "supersajayin"]
                        },
                        from: (0, amino_1.coin)(100, "sayajin"),
                        to: (0, amino_1.coin)(10, "supersajayin"),
                        orderPrice: "10500000000000000000",
                        offerFee: {
                            "amount": "5",
                            "denom": "sayajin"
                        }
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('addliquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgs = mapper.addliquidity({
                        pool: {
                            id: 1,
                            type_id: 1,
                            reserve_coin_denoms: ["sayajin", "supersajayin"]
                        },
                        coinA: (0, amino_1.coin)(100, "sayajin"),
                        coinB: (0, amino_1.coin)(10, "supersajayin")
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('withdrawliquidity', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgs = mapper.withdrawliquidity({
                        pool: {
                            id: 1,
                            type_id: 1
                        },
                        poolCoin: (0, amino_1.coin)(100, "sayajin")
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    it('createpool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var msgs, signDoc, _a, signed, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    msgs = mapper.createpool({
                        pool: {
                            id: 1,
                            type_id: 1
                        },
                        coinA: (0, amino_1.coin)(100, "sayajin"),
                        coinB: (0, amino_1.coin)(10, "supersajayin")
                    }, firstAccount.address);
                    signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, "memo", 0, 0);
                    return [4 /*yield*/, wallet.signAmino(firstAccount.address, signDoc)];
                case 1:
                    _a = _b.sent(), signed = _a.signed, signature = _a.signature;
                    expect({ signed: signed, signature: signature }).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
