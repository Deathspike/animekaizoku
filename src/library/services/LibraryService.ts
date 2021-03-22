import * as app from '..';
import * as ncm from '@nestjs/common';
import os from 'os';
import path from 'path';

@ncm.Injectable()
export class LibraryService {
  private readonly context: app.File<app.api.LibraryContext>;
  private readonly lock: app.Lock;

  constructor() {
    this.context = new app.File(app.api.LibraryContext, path.join(os.homedir(), 'animesync', 'context.json'), this.createContext.bind(this))
    this.lock = new app.Lock();
  }

  async contextGetAsync() {
    return await this.lock.runAsync(async () => {
      const context = await this.context.getAsync();
      return context;
    });
  }

  async contextPostAsync(model: app.api.LibraryContextSection) {
    return await this.lock.runAsync(async () => {
      if (path.resolve(model.path) === model.path) {
        const context = await this.context.getAsync();
        context.sections.push(model);
        await this.context.saveAsync();
        return true;
      } else {
        return false;
      }
    });
  }

  async sectionDeleteAsync(section: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.context.getAsync();
      const index = context.sections.findIndex(x => x.name === section);
      if (index >= 0) {
        context.sections.splice(index, 1);
        await this.context.saveAsync();
        return true;
      } else {
        return false;
      }
    });
  }

  seriesUpdateAsync(_: string) {
    // TODO: If the url changed, do a conflict resolution.
    // TODO: If title changed, do a move/conflict resolution.
  }

  private createContext() {
    return new app.api.LibraryContext({
      sections: [{name: 'library', path: app.settings.path.library}],
      version: 1
    });
  }
}
