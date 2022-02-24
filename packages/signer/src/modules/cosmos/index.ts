import { EmerisSigningClient } from './emerisSigningClient'
import { LedgerSigner } from '@cosmjs/ledger-amino'
import { Secp256k1HdWallet } from '@cosmjs/amino'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import CosmosSigningClient from './cosmosSigningClient'
import GravitySigningClient from './gravitySigningClient'
import OsmosisSigningClient from './osmosisSigningClient'
import cosmosRegistry from './cosmosRegistry';
import osmosisRegistry from './osmosisRegistry'
import gravityRegistry from './gravityRegistry'
import { stringToPath } from '@cosmjs/crypto'

export async function getCosmosClient(
  chain_name: string,
  isLedger: boolean,
  mnemonic?: string,
  HdPath?:string,
): Promise<EmerisSigningClient> {
  let signer
  if (isLedger) {
    signer = new LedgerSigner(await TransportWebHID.create(), { hdPaths: [stringToPath(HdPath)] })
  } else {
    signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, { hdPaths: [stringToPath(HdPath)]})
  }
  switch (chain_name) {
    case 'akash':
    case 'iris':
    case 'regen':
    case 'sentinel':
    case 'crypto-org':
    case 'crypto-com':
    case 'persistence':
    case 'ixo':
    case 'starname':
    case 'microtick':
    case 'emoney':
    case 'terra':
      return new CosmosSigningClient(undefined, signer, { registry: cosmosRegistry }, chain_name)
    case 'cosmos-hub':
      return new GravitySigningClient(undefined, signer, { registry: gravityRegistry }, chain_name)
    case 'osmosis':
      return new OsmosisSigningClient(undefined, signer, { registry: osmosisRegistry }, chain_name)
  }
}
