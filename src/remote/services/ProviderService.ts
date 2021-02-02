import * as app from '..';
import * as ncm from '@nestjs/common';
import {CrunchyRollProvider} from './crunchyroll';
import {FunimationProvider} from './funimation';

@ncm.Injectable()
export class ProviderService {
  private readonly crunchyrollProvider: CrunchyRollProvider;
  private readonly funimationProvider: FunimationProvider;

  constructor(browserService: app.BrowserService, composeService: app.ComposeService) {
    this.crunchyrollProvider = new CrunchyRollProvider(browserService, composeService);
    this.funimationProvider = new FunimationProvider(browserService, composeService);
  }

  async popularAsync(providerName: string, pageNumber?: number) {
    switch (providerName) {
      case app.api.RemoteProvider.CrunchyRoll:
        return await this.crunchyrollProvider.popularAsync(pageNumber);
      case app.api.RemoteProvider.Funimation:
        return await this.funimationProvider.popularAsync(pageNumber);
      default:
        throw new Error();
    }
  }

  async searchAsync(providerName: string, query: string, pageNumber?: number) {
    switch (providerName) {
      case app.api.RemoteProvider.CrunchyRoll:
        return await this.crunchyrollProvider.searchAsync(query, pageNumber);
      case app.api.RemoteProvider.Funimation:
        return await this.funimationProvider.searchAsync(query, pageNumber);
      default:
        throw new Error();
    }
  }

  async seriesAsync(seriesUrl: string) {
    if (this.crunchyrollProvider.isSupported(seriesUrl)) {
      return await this.crunchyrollProvider.seriesAsync(seriesUrl);
    } else if (this.funimationProvider.isSupported(seriesUrl)) {
      return await this.funimationProvider.seriesAsync(seriesUrl);
    } else {
      throw new Error();
    }
  }

  async streamAsync(episodeUrl: string) {
    if (this.crunchyrollProvider.isSupported(episodeUrl)) {
      return await this.crunchyrollProvider.streamAsync(episodeUrl);
    } else if (this.funimationProvider.isSupported(episodeUrl)) {
      return await this.funimationProvider.streamAsync(episodeUrl);
    } else {
      throw new Error();
    }
  }
}
