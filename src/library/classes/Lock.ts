import * as app from '..';

export class Lock {
  private readonly items: Array<{future: app.Future<any>, handlerAsync: () => any}>;
  private isRunning?: boolean;

  constructor() {
    this.items = [];
  }

  runAsync<T>(handlerAsync: () => Promise<T> | T) {
    const future = new app.Future<T>();
    this.items.push({future, handlerAsync});
    this.tryStart();
    return future.getAsync();
  }

  private async pumpAsync() {
    while (this.isRunning) {
      const item = this.items.shift();
      try {
        if (!item) continue;
        item.future.resolve(await item.handlerAsync());
      } catch (error) {
        if (!item) continue;
        item.future.reject(error);
      } finally {
        if (this.items.length) continue;
        this.isRunning = false;
      }
    }
  }

  private tryStart() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.pumpAsync();
  }
}
