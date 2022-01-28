import { CosmosRequest } from "./types/CosmosRequest";
import { SignerRequest } from "./types/requests";

export function isCosmos(obj: SignerRequest): obj is CosmosRequest {
  
    switch (obj.chain_name) {
      case "cosmos-hub":
      case "akash":
      case "iris":
      case "regen":
      case "osmosis":
      case "sentinel":
      case "crypto-org":
      case "crypto-com":
      case "persistence":
      case "ixo":
      case "starname":
      case "microtick":
      case "emoney":
      case "terra":
        return true;
      default:
        return false;
    }
}