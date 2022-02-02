import { coin, coins, makeSignDoc, Secp256k1HdWallet } from "@cosmjs/amino";
import CosmosAminoMessageMapper from "../src/cosmos_amino";

describe('Cosmos Mapps', () => {
    const mnemonic = "surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put";
    const chainId = "emeris-chain"
    const fee = {
        amount: coins(2000, "ucosm"),
        gas: "180000", // 180k
    };
    let firstAccount, mapper, wallet

    beforeAll(async () => {
        wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);
        [firstAccount] = await wallet.getAccounts();

        mapper = new CosmosAminoMessageMapper(chainId)
    })

    it('transfer', async () => {
        const msgs = mapper.transfer({
            amount: coins(2000, "ucosm"),
            to_address: firstAccount.address,
            chain_name: chainId
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address as string, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });

    it('ibcTransfer', async () => {
        jest
            .useFakeTimers('modern')
            .setSystemTime(new Date('2020-01-01').getTime());

        const msgs = mapper.ibcTransfer({
            from_chain: chainId,
            to_chain: "moon",
            through: "abcdchannel",
            to_address: firstAccount.address,
            amount: coins(2000, "ucosm"),
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });

    it('swap', async () => {
        const msgs = mapper.swap({
            pool: {
                id: 1,
                type_id: 1,
                reserve_coin_denoms: ["sayajin", "supersajayin"]
            },
            from: coin(100, "sayajin"),
            to: coin(10, "supersajayin"),
            orderPrice: "10500000000000000000",
            offerFee: {
                "amount": "5",
                "denom": "sayajin",
            }
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });

    it('addliquidity', async () => {
        const msgs = mapper.addliquidity({
            pool: {
                id: 1,
                type_id: 1,
                reserve_coin_denoms: ["sayajin", "supersajayin"]
            },
            coinA: coin(100, "sayajin"),
            coinB: coin(10, "supersajayin"),
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });

    it('withdrawliquidity', async () => {
        const msgs = mapper.withdrawliquidity({
            pool: {
                id: 1,
                type_id: 1
            },
            poolCoin: coin(100, "sayajin"),
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });

    it('createpool', async () => {
        const msgs = mapper.createpool({
            pool: {
                id: 1,
                type_id: 1
            },
            coinA: coin(100, "sayajin"),
            coinB: coin(10, "supersajayin"),
        }, firstAccount.address)

        const signDoc = makeSignDoc(msgs, fee, chainId, "memo", 0, 0);
        const { signed, signature } = await wallet.signAmino(firstAccount.address, signDoc);

        expect({ signed, signature }).toMatchSnapshot();
    });
})