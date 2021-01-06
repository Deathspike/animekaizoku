import * as app from '../..';
import {evaluateSeriesAsync} from './evaluators/series';

export const funimationProvider = {
  async seriesAsync(context: app.Context, seriesUrl: string): Promise<app.IApiSeries> {
    return await app.browserAsync(context, async (page, userAgent) => {
      await page.goto(seriesUrl, {waitUntil: 'domcontentloaded'});
      const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
      const series = await page.evaluate(evaluateSeriesAsync);
      series.imageUrl = context.rewrite.createEmulateUrl(series.imageUrl, headers);
      series.seasons.forEach(x => x.episodes.forEach(y => y.imageUrl = context.rewrite.createEmulateUrl(y.imageUrl, headers)));
      return series;
    });
  },

  async streamAsync(context: app.Context, episodeUrl: string): Promise<app.IApiStream> {
    return await app.browserAsync(context, async (page, userAgent) => {
      const [manifestPromise, vttSubtitlePromise] = new app.Observer(page).getAsync(/\.m3u8$/i, /\.vtt$/i);
      await page.goto(episodeUrl, {waitUntil: 'domcontentloaded'});
      const manifestSrc = await manifestPromise.then(x => x.url());
      const vttSubtitleSrc = await vttSubtitlePromise.then(x => x.url());
      await page.close();
      if (manifestSrc && vttSubtitleSrc) {
        const headers = Object.assign({'user-agent': userAgent}, defaultHeaders);
        const manifestType = 'hls';
        const manifestUrl = context.rewrite.createHlsUrl(manifestSrc, headers);
        const subtitleUrl = context.rewrite.createEmulateUrl(vttSubtitleSrc, headers);
        const subtitles = [{language: 'eng', type: 'vtt', url: subtitleUrl}];
        return {manifestType, manifestUrl, subtitles};
      } else {
        throw new Error();
      }
    });
  }
};

const defaultHeaders = {
  origin: 'https://www.funimation.com',
  referer: 'https://www.funimation.com/'
};
