import { Emeris } from "@/shims-vue";

export function init(emeris: Emeris): void {
	console.log('Here');
  window.emeris = emeris;
}
