import * as app from '..';
import fs from 'fs-extra';
import path from 'path';

export class Section {
  private readonly filePath: string;
  private readonly section: app.api.LibraryContextSection;
  private readonly series: Record<string, app.File<app.api.LibrarySeries>>;
  
  constructor(section: app.api.LibraryContextSection) {
    this.filePath = path.join(section.path, '.animeloyalty', '.section');
    this.section = section;
    this.series = {};
  }
  
  async getAsync() {
    await this.initAsync();
    return new app.api.LibrarySection({
      name: this.section.name,
      path: this.section.path,
      series: await Promise.all(Object.values(this.series)
        .map(x => x.getAsync())
        .map(x => x.then(y => new app.api.LibrarySectionSeries({...y, unwatchedCount: fetchUnwatchedCount(y)}))))
    });
  }

  private async initAsync() {
    if (Object.keys(this.series).length) return;
    await fs.ensureDir(this.filePath);
    for (const fileName of await fs.readdir(this.filePath)) {
      const filePath = path.join(this.filePath, fileName);
      const url = Buffer.from(fileName, 'base64').toString('utf8');
      this.series[url] = new app.File(app.api.LibrarySeries, filePath);
    }
  }
}

function fetchUnwatchedCount(series: app.api.LibrarySeries) {
  const episodes = series.seasons.reduce((p, c) => p.concat(c.episodes), [] as Array<app.api.LibrarySeriesSeasonEpisode>);
  const unwatched = episodes.filter(x => !x.hasWatched);
  return unwatched.length;
}
