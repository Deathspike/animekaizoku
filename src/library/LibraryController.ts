import * as app from '.';
import * as ncm from '@nestjs/common';
import * as nsg from '@nestjs/swagger';

@ncm.Controller('api/library')
@ncm.UseInterceptors(app.ResponseLoggerInterceptor)
@nsg.ApiTags('library')
@nsg.ApiBadRequestResponse()
@nsg.ApiInternalServerErrorResponse()
export class LibraryController {
  private readonly libraryService: app.LibraryService;

  constructor(libraryService: app.LibraryService) {
    this.libraryService = libraryService;
  }

  @app.ResponseValidator(app.api.LibraryContext)
  @ncm.Get()
  @nsg.ApiResponse({status: 200, type: app.api.LibraryContext})
  async contextGetAsync() {
    return await this.libraryService.contextGetAsync().then(app.StatusCodeError.open);
  }

  @ncm.Post()
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 409})
  async contextPostAsync(@ncm.Body() model: app.api.LibraryContextSection) {
    await this.libraryService.contextPostAsync(model).then(app.StatusCodeError.open);
  }

  @ncm.Delete(':section')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  @nsg.ApiResponse({status: 409})
  async sectionDeleteAsync(@ncm.Param() param: app.api.LibraryParamSection) {
    await this.libraryService.sectionDeleteAsync(param.section).then(app.StatusCodeError.open);
  }

  @app.ResponseValidator(app.api.LibrarySection)
  @ncm.Get(':section')
  @nsg.ApiResponse({status: 200, type: app.api.LibrarySection})
  @nsg.ApiResponse({status: 404})
  async sectionGetAsync(@ncm.Param() param: app.api.LibraryParamSection) {
    return await this.libraryService.sectionGetAsync(param.section).then(app.StatusCodeError.open);
  }

  @ncm.Post(':section')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  @nsg.ApiResponse({status: 409})
  async sectionPostAsync(@ncm.Param() param: app.api.LibraryParamSection, @ncm.Body() model: app.api.LibraryContentSection) {
    await this.libraryService.sectionPostAsync(param.section, model.url).then(app.StatusCodeError.open);
  }

  @ncm.Delete(':section/:seriesUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  async seriesDeleteAsync(@ncm.Param() param: app.api.LibraryParamSeries) {
    await this.libraryService.seriesDeleteAsync(param.section, param.seriesUrl).then(app.StatusCodeError.open);
  }

  @ncm.Get(':section/:seriesUrl')
  @nsg.ApiResponse({status: 200, type: [app.api.LibrarySeries]})
  @nsg.ApiResponse({status: 404})
  async seriesGetAsync(@ncm.Param() param: app.api.LibraryParamSeries) {
    return await this.libraryService.seriesGetAsync(param.section, param.seriesUrl).then(app.StatusCodeError.open);
  }

  @ncm.Patch(':section/:seriesUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  async seriesPatchAsync(@ncm.Param() param: app.api.LibraryParamSeries, @ncm.Body() model: app.api.LibraryContentSeries) {
    await this.libraryService.seriesPatchAsync(param.section, param.seriesUrl, model.automation).then(app.StatusCodeError.open);
  }
  
  @ncm.Put(':section/:seriesUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  seriesPut(@ncm.Param() param: app.api.LibraryParamSeries) {
    throw new Error(String(param));
  }

  @ncm.Delete(':section/:seriesUrl/:episodeUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  episodeDelete(@ncm.Param() param: app.api.LibraryParamEpisode) {
    throw new Error(String(param));
  }

  @ncm.Get(':section/:seriesUrl/:episodeUrl')
  @nsg.ApiResponse({status: 200, type: [app.api.RemoteStream]})
  @nsg.ApiResponse({status: 404})
  episodeGet(@ncm.Param() param: app.api.LibraryParamEpisode) {
    throw new Error(String(param));
  }  
  
  @ncm.Patch(':section/:seriesUrl/:episodeUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  episodePatch(@ncm.Param() param: app.api.LibraryParamEpisode, @ncm.Body() model: app.api.LibraryContentSeriesEpisode) {
    throw new Error(String(param) + String(model));
  }
}
