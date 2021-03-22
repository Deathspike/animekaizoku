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
    return await this.libraryService.contextGetAsync();
  }

  @ncm.Post()
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 409})
  async contextPostAsync(@ncm.Body() model: app.api.LibraryContextSection) {
    if (await this.libraryService.contextPostAsync(model)) return;
    throw new ncm.BadRequestException();
  }

  @ncm.Delete(':section')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  @nsg.ApiResponse({status: 409})
  async sectionDeleteAsync(@ncm.Param() param: app.api.LibraryParamSection) {
    if (await this.libraryService.sectionDeleteAsync(param.section)) return;
    throw new ncm.NotFoundException();
  }

  @app.ResponseValidator([app.api.LibrarySection])
  @ncm.Get(':section')
  @nsg.ApiResponse({status: 200, type: [app.api.LibrarySection]})
  @nsg.ApiResponse({status: 404})
  sectionGet(@ncm.Param() param: app.api.LibraryParamSection) {
    throw new Error(String(param));
  }

  @ncm.Post(':section')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  @nsg.ApiResponse({status: 409})
  sectionPost(@ncm.Param() param: app.api.LibraryParamSection, @ncm.Body() model: app.api.LibraryContentSeries) {
    throw new Error(String(param) + String(model));
  }

  @ncm.Delete(':section/:seriesUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  seriesDelete(@ncm.Param() param: app.api.LibraryParamSeries) {
    throw new Error(String(param));
  }

  @ncm.Get(':section/:seriesUrl')
  @nsg.ApiResponse({status: 200, type: [app.api.LibrarySeries]})
  @nsg.ApiResponse({status: 404})
  seriesGet(@ncm.Param() param: app.api.LibraryParamSeries) {
    throw new Error(String(param));
  }

  @ncm.Patch(':section/:seriesUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  seriesPatch(@ncm.Param() param: app.api.LibraryParamSeries, @ncm.Body() model: app.api.LibraryContentSeriesAutomation) {
    throw new Error(String(param) + String(model));
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
  episodeDelete(@ncm.Param() param: app.api.LibraryParamSeriesEpisode) {
    throw new Error(String(param));
  }

  @ncm.Get(':section/:seriesUrl/:episodeUrl')
  @nsg.ApiResponse({status: 200, type: [app.api.RemoteStream]})
  @nsg.ApiResponse({status: 404})
  episodeGet(@ncm.Param() param: app.api.LibraryParamSeriesEpisode) {
    throw new Error(String(param));
  }  
  
  @ncm.Patch(':section/:seriesUrl/:episodeUrl')
  @ncm.HttpCode(204)
  @nsg.ApiResponse({status: 204})
  @nsg.ApiResponse({status: 404})
  episodePatch(@ncm.Param() param: app.api.LibraryParamSeriesEpisode, @ncm.Body() model: app.api.LibraryContentSeriesEpisode) {
    throw new Error(String(param) + String(model));
  }
}
