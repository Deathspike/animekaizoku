import * as app from '../..';

export function parseSeries(remote: app.api.RemoteSeries, local?: app.api.LibrarySeries) {
  const seasons = new Array<app.api.LibrarySeriesSeason>();
  seasons.push(...remote.seasons.map(x => createSeason(x, local?.seasons.find(x => x.title.toLowerCase() === x.title.toLowerCase()))));
  seasons.push(...local?.seasons.filter(x => remote.seasons.every(y => x.title.toLowerCase() !== y.title.toLowerCase()) && x.episodes.some(x => x.downloadedAt)) ?? []);
  return seasons;
}

function createSeason(remote: app.api.RemoteSeriesSeason, local?: app.api.LibrarySeriesSeason) {
  const episodes = new Array<app.api.LibrarySeriesSeasonEpisode>();
  remote.episodes.forEach((remote) => mergeRemote(episodes, remote, local?.episodes.find(x => x.url.toLowerCase() === remote.url.toLowerCase())));
  local?.episodes.forEach((local) => mergeLocal(episodes, remote, local));
  return new app.api.LibrarySeriesSeason({episodes, title: remote.title});
}

function mergeLocal(episodes: Array<app.api.LibrarySeriesSeasonEpisode>, remote: app.api.RemoteSeriesSeason, local: app.api.LibrarySeriesSeasonEpisode) {
  if (!local.downloadedAt || remote.episodes.some(x => x.url.toLowerCase() === local.url.toLowerCase())) return;
  episodes.push(new app.api.LibrarySeriesSeasonEpisode(local, {
    deletedAt: local.deletedAt ?? Date.now()
  }));
}

function mergeRemote(episodes: Array<app.api.LibrarySeriesSeasonEpisode>, remote: app.api.RemoteSeriesSeasonEpisode, local?: app.api.LibrarySeriesSeasonEpisode) {
  episodes.push(new app.api.LibrarySeriesSeasonEpisode(local, {
    addedAt: local ? local.addedAt : Date.now(),
    imageUrl: remote.imageUrl,
    isPremium: remote.isPremium,
    name: remote.name,
    title: remote.title,
    url: remote.url
  }));
}
