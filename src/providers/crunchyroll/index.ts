import * as app from '../..';
import {httpAsync} from './utilities/http';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
import scraper from './scraper';

export async function crunchyrollAsync(rootPath: string, seriesUrl: string, options?: app.ISeriesOptions) {
  const series = new app.Series(app.settings.library);
  await app.browserAsync(async (page) => {
    await page.goto(seriesUrl, {waitUntil: 'domcontentloaded'});
    const seasons = await page.evaluate(scraper.seasons);
    await page.close();
    for (const season of seasons) {
      if (/\(.+\)/.test(season.title)) continue;
      const seriesName = sanitizeFilename(season.title);
      const seriesPath = path.join(rootPath, seriesName);
      for (const episode of season.episodes) {
        const numberMatch = episode.title.match(/([0-9]+(?:\.[0-9])?)/);
        const number = numberMatch ? parseFloat(numberMatch[1]) : -1;
        if (number >= 0) {
          const elapsedTime = new app.Timer();
          const episodeName = `${seriesName} ${String(number).padStart(2, '0')} [CrunchyRoll]`;
          const episodePath = `${path.join(seriesPath, episodeName)}.mkv`;
          if (await series.existsAsync(seriesName, episodeName)) {
            console.log(`Skipping ${episodeName}`);
          } else if (options && options.skipDownload) {
            console.log(`Tracking ${episodeName}`);
            await series.trackAsync(seriesName, episodeName);
          } else try {
            console.log(`Fetching ${episodeName}`);
            await episodeAsync(episodePath, episode.url);
            await series.trackAsync(seriesName, episodeName);
            console.log(`Finished ${episodeName} (${elapsedTime})`);
          } catch (err) {
            console.log(`Rejected ${episodeName} (${elapsedTime})`);
            console.error(err);
          }
        }
      }
    }
  });
}

async function episodeAsync(episodePath: string, episodeUrl: string) {
  const sync = new app.Sync(episodePath, 'ass');
  await app.browserAsync(async (page, options) => {
    const [assSubtitlePromise] = new app.Observer(page).getAsync(/\.txt$/i);
    await page.goto(episodeUrl, {waitUntil: 'domcontentloaded'});
    const m3u8 = await page.content().then(extractAsync);
    const assSubtitle = await assSubtitlePromise.then(x => x.url()).then(httpAsync);
    await page.close();
    if (m3u8 && assSubtitle) try {
      await sync.saveAsync(m3u8, assSubtitle, options);
    } finally {
      await sync.disposeAsync();
    } else {
      throw new Error(`Invalid episode: ${episodeUrl}`);
    }
  });
}

async function extractAsync(content: string) {
  const metadataMatch = content.match(/vilos\.config\.media\s*=\s*({.+});/);
  const metadata = metadataMatch && JSON.parse(metadataMatch[1]) as EpisodeMetadata;
  const stream = metadata?.streams.find(x => x.format === 'adaptive_hls' && !x.hardsub_lang);
  return stream?.url;
}

type EpisodeMetadata = {
  streams: Array<{format: string, hardsub_lang: string | null, url: string}>;
};
