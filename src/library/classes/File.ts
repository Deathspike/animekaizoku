import * as app from '..';
import * as ncm from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

export class File<T> {
  private readonly cls: ncm.Type<T>;
  private readonly filePath: string;
  private readonly initializeAsync?: () => Promise<T> | T;
  private value?: Promise<T>;

  constructor(cls: ncm.Type<T>, filePath: string, initializeAsync?: () => Promise<T> | T) {
    this.cls = cls;
    this.filePath = filePath;
    this.initializeAsync = initializeAsync;
  }

  async getAsync() {
    try {
      if (this.value) return await this.value;
      this.value = this.readAsync();
      return await this.value;
    } catch (error) {
      delete this.value;
      throw error;
    }
  }

  async saveAsync() {
    try {
      const value = await this.getAsync();
      await this.writeAsync(value);
    } catch (error) {
      delete this.value;
      throw error;
    }
  }

  private async readAsync() {
    try {
      const value = await fs.readJson(this.filePath).then(x => new this.cls(x));
      await app.ValidationError.validateAsync(this.cls, value);
      return value;
    } catch (error) {
      if (error && error.code === 'ENOENT' && this.initializeAsync) {
        const value = await Promise.resolve(this.initializeAsync());
        await this.writeAsync(value);
        return value;
      } else {
        throw error;
      }
    }
  }

  private async writeAsync(value: T) {
    await app.ValidationError.validateAsync(this.cls, value);
    await fs.ensureDir(path.dirname(this.filePath));
    await fs.writeJson(`${this.filePath}.tmp`, value, {spaces: 2});
    await fs.move(`${this.filePath}.tmp`, this.filePath, {overwrite: true});
  }
}
