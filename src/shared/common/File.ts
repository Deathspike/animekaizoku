import * as app from '..';
import * as clt from 'class-transformer';
import * as ncm from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

export class File<T> {
  private readonly cls: ncm.Type<T>;
  private readonly filePath: string;
  private readonly initializeAsync?: () => Promise<T>;
  private fileData?: string;

  constructor(cls: ncm.Type<T>, filePath: string, initializeAsync?: () => Promise<T>) {
    this.cls = cls;
    this.filePath = filePath;
    this.initializeAsync = initializeAsync;
  }

  async getAsync() {
    try {
      this.fileData ??= await fs.readFile(this.filePath, 'utf8');
      const value = clt.plainToClass(this.cls, JSON.parse(this.fileData));
      await app.ValidationError.validateAsync(this.cls, value);
      return value;
    } catch (error) {
      if (error && error.code === 'ENOENT' && this.initializeAsync) try {
        const value = await this.initializeAsync();
        await this.setAsync(value);
        return value;
      } catch (error) {
        delete this.fileData;
        throw error;
      } else {
        delete this.fileData;
        throw error;
      }
    }
  }

  async setAsync(value: T) {
    await app.ValidationError.validateAsync(this.cls, value);
    const fileData = JSON.stringify(value, null, 2);
    await fs.ensureDir(path.dirname(this.filePath));
    await fs.writeFile(`${this.filePath}.tmp`, fileData);
    await fs.move(`${this.filePath}.tmp`, this.filePath, {overwrite: true});
    this.fileData = fileData;
  }
}
