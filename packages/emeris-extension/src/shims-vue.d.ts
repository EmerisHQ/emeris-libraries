import { IEmeris } from "./types/emeris";

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

export type EmerisWindow = {
  emeris: IEmeris;
};
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends EmerisWindow {}
}
