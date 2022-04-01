export default class Queue<T> {
  private items: Array<T>;
  constructor() {
    this.items = [];
  }
  enqueue(item: T): number {
    return this.items.unshift(item);
  }
  dequeue(): T {
    return this.items.pop();
  }
  head(): T {
    return this.items[this.items.length - 1];
  }
  tail(): T {
    return this.items[0];
  }
  isEmpty(): boolean {
    if (this.items.length == 0) {
      return true;
    } else {
      return false;
    }
  }
  advanceQueue(item: T): number {
    return this.items.push(item);
  }
  size(): number {
    return this.items.length;
  }
}
