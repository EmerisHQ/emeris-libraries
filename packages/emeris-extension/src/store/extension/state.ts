import { ExtensionRequest } from "@/types";

export type State = {
  pending: Array<ExtensionRequest>;
};
export function getDefaultState(): State {
	return {
		pending: []
  };
}
