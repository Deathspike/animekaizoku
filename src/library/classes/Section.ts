import * as app from '..';
import fs from 'fs-extra';
import path from 'path';
import {parseSeries} from './utilities/parseSeries';
const serverApi = new app.api.ServerApi(app.settings.server.url);

export class Section {
  private readonly filePath: string;
  private readonly section: app.api.LibraryContextSection;
  private readonly series: Record<string, app.File<app.api.LibrarySeries>>;
  
  constructor(section: app.api.LibraryContextSection) {
    this.filePath = path.join(section.path, '.animeloyalty', '.series');
    this.section = section;
    this.series = {};
  }
  
  async sectionGetAsync() {
    await this.initAsync();
    return new app.api.LibrarySection({
      name: this.section.name,
      path: this.section.path,
      series: await Promise.all(Object.values(this.series)
        .map(x => x.readAsync())
        .map(x => x.then(y => new app.api.LibrarySectionSeries({...y, unwatchedCount: fetchUnwatchedCount(y.seasons)}))))
    });
  }

  async sectionPostAsync(seriesUrl: string) {
    await this.initAsync();
    const response = await serverApi.remote.seriesAsync({url: seriesUrl});
    if (response.value && !this.series[response.value.url.toLowerCase()]) {
      const seriesUrl = response.value.url.toLowerCase();
      const seasons = parseSeries(response.value);
      const filePath = path.join(this.filePath, `${Buffer.from(seriesUrl).toString('base64')}.json`);
      const file = new app.File<app.api.LibrarySeries>(app.api.LibrarySeries, filePath);
      await file.createOrUpdateAsync(new app.api.LibrarySeries({
        addedAt: Date.now(),
        episodeAddedAt: fetchEpisodeAddedAt(seasons),
        genres: response.value.genres,
        imageUrl: response.value.imageUrl,
        seasons: seasons,
        synopsis: response.value.synopsis,
        title: response.value.title,
        url: seriesUrl
      }));
      this.series[seriesUrl] = file;
      return app.StatusCode.Default;
    } else if (response.value) {
      return app.StatusCode.Conflict;
    } else {
      return app.StatusCode.NotFound;
    }
  }

  async seriesDeleteAsync(seriesUrl: string) {
    await this.initAsync();
    if (this.series[seriesUrl.toLowerCase()]) {
      await this.series[seriesUrl.toLowerCase()].deleteAsync();
      delete this.series[seriesUrl.toLowerCase()];
      return app.StatusCode.Default;
    } else {
      return app.StatusCode.NotFound;
    }
  }

  async seriesGetAsync(seriesUrl: string) {
    await this.initAsync();
    if (this.series[seriesUrl.toLowerCase()]) {
      return await this.series[seriesUrl.toLowerCase()].readAsync();
    } else {
      return app.StatusCode.NotFound;
    }
  }

  private async initAsync() {
    if (Object.keys(this.series).length) return;
    await fs.ensureDir(this.filePath);
    for (const fileName of await fs.readdir(this.filePath)) {
      const filePath = path.join(this.filePath, fileName);
      const url = Buffer.from(path.parse(fileName).name, 'base64').toString('utf8');
      this.series[url] = new app.File(app.api.LibrarySeries, filePath);
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
