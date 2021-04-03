import * as app from '..';
import * as ncm from '@nestjs/common';
import os from 'os';
import path from 'path';

@ncm.Injectable()
export class LibraryService {
  private readonly file: app.File<app.api.LibraryContext>;
  private readonly lock: app.Lock;
  private readonly sections: app.Dictionary<app.Section>;

  constructor() {
    this.file = new app.File(app.api.LibraryContext, path.join(os.homedir(), 'animeloyalty', 'context.json'), this.createContext.bind(this))
    this.lock = new app.Lock();
    this.sections = new app.Dictionary();
  }

  async contextGetAsync() {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      return context;
    });
  }

  async contextPostAsync(model: app.api.LibraryContextSection) {
    return await this.lock.runAsync(async () => {
      if (path.resolve(model.path) === model.path) {
        const context = await this.file.getAsync();
        context.sections.push(model);
        await this.file.setAsync(context);
        this.synchronizeSections(context);
        return app.StatusCode.Default;
      } else {
        return app.StatusCode.Conflict;
      }
    });
  }

  async sectionDeleteAsync(sectionName: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      const index = context.sections.findIndex(x => x.name === sectionName);
      if (index >= 0) {
        context.sections.splice(index, 1);
        await this.file.setAsync(context);
        this.synchronizeSections(context);
        return app.StatusCode.Default;
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  async sectionGetAsync(sectionName: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      if (this.sections.exists(sectionName)) {
        return await this.sections.get(sectionName).sectionGetAsync();
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  async sectionPostAsync(sectionName: string, seriesUrl: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      if (this.sections.exists(sectionName)) {
        return await this.sections.get(sectionName).sectionPostAsync(seriesUrl);
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  async seriesDeleteAsync(sectionName: string, seriesUrl: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      if (this.sections.exists(sectionName)) {
        return await this.sections.get(sectionName).seriesDeleteAsync(seriesUrl);
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  async seriesGetAsync(sectionName: string, seriesUrl: string) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      if (this.sections.exists(sectionName)) {
        return await this.sections.get(sectionName).seriesGetAsync(seriesUrl);
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  async seriesPatchAsync(sectionName: string, seriesUrl: string, automation?: app.api.LibraryContentSeriesAutomation) {
    return await this.lock.runAsync(async () => {
      const context = await this.file.getAsync();
      this.synchronizeSections(context);
      if (this.sections.exists(sectionName)) {
        return await this.sections.get(sectionName).seriesPatchAsync(seriesUrl, automation);
      } else {
        return app.StatusCode.NotFound;
      }
    });
  }

  seriesUpdateAsync(_url: string) {
    // TODO: If the url changed, do a conflict resolution.
    // TODO: If title changed, do a move/conflict resolution.
  }

  private createContext() {
    const defaultPath = path.join(os.homedir(), 'animeloyalty', 'library');
    const section = new app.api.LibraryContextSection({name: 'library', path: defaultPath});
    return Promise.resolve(new app.api.LibraryContext({sections: [section], version: 1}));
  }

  private async synchronizeSections(context: app.api.LibraryContext) {
    context.sections
      .filter(x => !this.sections.exists(x.name))
      .forEach(x => this.sections.set(x.name, new app.Section(x)));
    this.sections.entries().map(([k]) => k)
      .filter(x => context.sections.every(y => y.name !== x))
      .forEach(x => this.sections.delete(x));
  }
}
