/**
 * Created for the sole purpose of persisting the created password from
 * PasswordCreateForm.vue to AccountCreate.vue
 * Refactor to a safer approach maybe?
 */
export class LocalStore extends Map {
  public getAndDelete(key): any {
    const value = this.get(key);
    this.delete(key);
    return value;
  }
}

const memoryStore = new LocalStore();
export { memoryStore };
