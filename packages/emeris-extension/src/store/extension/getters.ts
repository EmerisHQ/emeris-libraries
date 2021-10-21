import { ExtensionRequest } from '@/types/index';
import { GetterTree } from 'vuex';
import { GetterTypes, GlobalGetterTypes } from './getter-types';
import { ExtensionState } from './state';
import { RootState } from '..';
export interface Getters {
	[GetterTypes.getPending](state: ExtensionState): ExtensionRequest[]
}

export interface GlobalGetters {
  [GlobalGetterTypes.getPending](
    ...args: Parameters<Getters[GetterTypes.getPending]>
  ): ReturnType<Getters[GetterTypes.getPending]>;
}

export const getters: GetterTree<ExtensionState, RootState> & Getters = {
  [GetterTypes.getPending]: (state) => {
    return state.pending;
  },
};