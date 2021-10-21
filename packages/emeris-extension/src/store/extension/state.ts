import { ExtensionRequest } from "@/types";

export type ExtensionState = {
  pending: Array<ExtensionRequest>;
};
export function getDefaultState(): ExtensionState {
	return {
		pending: []
  };
}
