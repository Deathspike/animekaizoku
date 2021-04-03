export class Dictionary<T> {
  private readonly values: Record<string, T>;
  
  constructor() {
    this.values = {};
  }

  delete(key: string) {
    if (!this.exists(key)) throw new Error();
    delete this.values[key.toLowerCase()];
  }

  entries() {
    return Object.entries(this.values);
  }

  exists(key: string) {
    return this.values.hasOwnProperty(key.toLowerCase());
  }

  get(key: string) {
    if (!this.exists(key)) throw new Error();
    return this.values[key.toLowerCase()];
  }

  set(key: string, value: T) {
    this.values[key.toLowerCase()] = value;
  }
}
