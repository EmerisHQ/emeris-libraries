/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
export type Emeris = {
    loaded: boolean,
    sendRequest: (request: unknown) => Promise<unknown>
  }
export type EmerisWindow = {
  emeris: Emeris
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends EmerisWindow {}
}