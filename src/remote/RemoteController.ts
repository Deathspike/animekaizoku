import * as app from '.';
import * as ncm from '@nestjs/common';
import * as nsg from '@nestjs/swagger';
import fetch from 'node-fetch';

@ncm.Controller('api/remote')
@ncm.UseInterceptors(app.ResponseLoggerInterceptor)
@nsg.ApiTags('remote')
@nsg.ApiBadRequestResponse()
@nsg.ApiInternalServerErrorResponse()
export class RemoteController {
  private readonly cacheService: app.CacheService;
  private readonly providerService: app.ProviderService;

  constructor(cacheService: app.CacheService, providerService: app.ProviderService) {
    this.cacheService = cacheService;
    this.providerService = providerService;
  }

  @app.ResponseValidator([app.api.RemoteProvider])
  @ncm.Get()
  @nsg.ApiResponse({status: 200, type: [app.api.RemoteProvider]})
  async contextAsync(@ncm.Query() model: app.api.RemoteQueryContext) {
    return await this.providerService.contextAsync(model.url);
  }

  @app.ResponseValidator(app.api.RemoteSearch)
  @ncm.Get('page')
  @nsg.ApiResponse({status: 200, type: app.api.RemoteSearch})
  @nsg.ApiResponse({status: 404})
  async pageAsync(@ncm.Query() model: app.api.RemoteQueryPage) {
    const cacheKey = `remote/page/${model.page}/${model.provider}/${model.options?.join(',')}/${model.pageNumber ?? 1}`;
    const cacheTimeout = app.settings.core.cacheTimeoutPage;
    return await this.cacheService.getAsync(cacheKey, cacheTimeout, () => this.providerService.pageAsync(model.provider, model.page, model.options, model.pageNumber));
  }

  @app.ResponseValidator(app.api.RemoteSearch)
  @ncm.Get('search')
  @nsg.ApiResponse({status: 200, type: app.api.RemoteSearch})
  @nsg.ApiResponse({status: 404})
  async searchAsync(@ncm.Query() model: app.api.RemoteQuerySearch) {
    const cacheKey = `remote/search/${model.provider}/${model.query}/${model.pageNumber ?? 1}`;
    const cacheTimeout = app.settings.core.cacheTimeoutSearch;
    return await this.cacheService.getAsync(cacheKey, cacheTimeout, () => this.providerService.searchAsync(model.provider, model.query, model.pageNumber));
  }

  @app.ResponseValidator(app.api.RemoteSeries)
  @ncm.Get('series')
  @nsg.ApiResponse({status: 200, type: app.api.RemoteSeries})
  @nsg.ApiResponse({status: 404})
  async seriesAsync(@ncm.Query() model: app.api.RemoteQuerySeries) {
    const cacheKey = `remote/series/${model.url}`;
    const cacheTimeout = app.settings.core.cacheTimeoutSeries;
    return await this.cacheService.getAsync(cacheKey, cacheTimeout, () => this.providerService.seriesAsync(model.url));
  }

  @app.ResponseValidator(app.api.RemoteStream)
  @ncm.Get('stream')
  @nsg.ApiResponse({status: 200, type: app.api.RemoteStream})
  @nsg.ApiResponse({status: 404})
  async streamAsync(@ncm.Query() model: app.api.RemoteQueryStream) {
    const cacheKey = `remote/stream/${model.url}`;
    const cacheTimeout = app.settings.core.cacheTimeoutStream;
    return await this.cacheService.getAsync(cacheKey, cacheTimeout, () => this.providerService.streamAsync(model.url));
  }

  @ncm.Get('m3u8')
  @nsg.ApiResponse({status: 200})
  @nsg.ApiResponse({status: 404})
  async m3u8(@ncm.Query() model: app.api.RemoteQueryStream) {
    const cacheKey = `remote/m3u8/${model.url}`;
    const cacheTimeout = app.settings.core.cacheTimeoutStream;
    return await this.cacheService.getAsync(cacheKey, cacheTimeout, async () => {
      const stream = await this.providerService.streamAsync(model.url);
      const source = stream.sources.shift();
      const response = await fetch(source!.url);

      const hls = app.HlsManifest.from(await response.text());

      for (let i = 0; i < hls.length; i++) {
        if (hls[i].type !== 'EXT-X-STREAM-INF') continue;

        const lines = stream.subtitles
          .filter(x => x.language === 'en-US')
          .map(x => {
          return `#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subtitles",NAME="caption_1",DEFAULT=YES,AUTOSELECT=YES,FORCED=NO,LANGUAGE="eng",URI="${x.url}"`;
          // return `#EXTVLCOPT:input-slave="${x.url}"`;
          });

        hls[i].params['SUBTITLES'] = 'subtitles';
        hls.splice(i, 0, ...lines.map(x => app.HlsManifestLine.from(x)));
        break;
      }

      console.log(hls.toString());
      return hls.toString();
    });
  }
}
