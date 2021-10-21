import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { SigningStargateClient } from "@cosmjs/stargate";
import { getMnemonic } from "./mnemonic";
import { getChain } from "./api";
import { LCDClient, LCDClientConfig, MnemonicKey, Wallet } from "@terra-money/terra.js";

export const getCosmosSigningClient = async (
  chain_name
): Promise<SigningStargateClient> => {
  try {
    const mnemonic = await getMnemonic();
    const chain = await getChain(chain_name);

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [stringToPath(chain.derivation_path)],
      prefix: chain.node_info.bech32_config.main_prefix,
    });

    const client = await SigningStargateClient.offline(signer, { registry });
    return client;
  } catch (e) {
    throw "Could not instantiate Cosmos client";
  }
};

export const getTerraSigningClient = async (
  chain_name
): Promise<Wallet> => {
  try {
    const mnemonic = await getMnemonic();
    const chain = await getChain(chain_name);

    const lcd =new LCDClient({URL: '', chainID: chain.node_info.chain_id } as LCDClientConfig);
    const wallet=lcd.wallet(new MnemonicKey({mnemonic}));

    return wallet;
  } catch (e) {
    throw "Could not instantiate Cosmos client";
  }
};
