import * as app from '..';
import fs from 'fs-extra';
import path from 'path';
import {parseSeries} from './utilities/parseSeries';
const serverApi = new app.api.ServerApi(app.settings.server.url);

export class Section {
  private readonly filePath: string;
  private readonly section: app.api.LibraryContextSection;
  private readonly series: app.Dictionary<app.File<app.api.LibrarySeries>>;
  
  constructor(section: app.api.LibraryContextSection) {
    this.filePath = path.join(section.path, '.animeloyalty', '.series');
    this.section = section;
    this.series = new app.Dictionary();
  }
  
  async sectionGetAsync() {
    await this.initAsync();
    return new app.api.LibrarySection({
      name: this.section.name,
      path: this.section.path,
      series: await Promise.all(this.series.entries().map(([_, v]) => v)
        .map(x => x.getAsync())
        .map(x => x.then(y => new app.api.LibrarySectionSeries({...y, unwatchedCount: fetchUnwatchedCount(y.seasons)}))))
    });
  }

  async sectionPostAsync(seriesUrl: string) {
    await this.initAsync();
    const response = await serverApi.remote.seriesAsync({url: seriesUrl});
    if (response.value && !this.series.exists(response.value.url)) {
      const seasons = parseSeries(response.value);
      const filePath = path.join(this.filePath, `${Buffer.from(response.value.url).toString('base64')}.json`);
      const file = new app.File<app.api.LibrarySeries>(app.api.LibrarySeries, filePath);
      await file.setAsync(new app.api.LibrarySeries({
        addedAt: Date.now(),
        episodeAddedAt: fetchEpisodeAddedAt(seasons),
        genres: response.value.genres,
        imageUrl: response.value.imageUrl,
        seasons: seasons,
        synopsis: response.value.synopsis,
        title: response.value.title,
        url: response.value.url
      }));
      this.series.set(response.value.url, file);
      return app.StatusCode.Default;
    } else if (response.value) {
      return app.StatusCode.Conflict;
    } else {
      return app.StatusCode.NotFound;
    }
  }

  async seriesDeleteAsync(seriesUrl: string) {
    await this.initAsync();
    if (this.series.exists(seriesUrl)) {
      await this.series.get(seriesUrl).deleteAsync();
      this.series.delete(seriesUrl);
      return app.StatusCode.Default;
    } else {
      return app.StatusCode.NotFound;
    }
  }

  async seriesGetAsync(seriesUrl: string) {
    await this.initAsync();
    if (this.series.exists(seriesUrl)) {
      return await this.series.get(seriesUrl).getAsync();
    } else {
      return app.StatusCode.NotFound;
    }
  }

  private async initAsync() {
    if (this.series.entries().length) return;
    await fs.ensureDir(this.filePath);
    for (const fileName of await fs.readdir(this.filePath)) {
      const filePath = path.join(this.filePath, fileName);
      const url = Buffer.from(path.parse(fileName).name, 'base64').toString('utf8');
      this.series.set(url, new app.File(app.api.LibrarySeries, filePath));
    }
  }
}

function fetchEpisodeAddedAt(seasons: Array<app.api.LibrarySeriesSeason>) {
  return seasons
    .reduce((p, c) => p.concat(c.episodes), [] as Array<app.api.LibrarySeriesSeasonEpisode>)
    .sort((a, b) => b.addedAt - a.addedAt)
    .shift()?.addedAt;
}

function fetchUnwatchedCount(seasons: Array<app.api.LibrarySeriesSeason>) {
  const episodes = seasons.reduce((p, c) => p.concat(c.episodes), [] as Array<app.api.LibrarySeriesSeasonEpisode>);
  const unwatched = episodes.filter(x => !x.hasWatched);
  return unwatched.length;
}
