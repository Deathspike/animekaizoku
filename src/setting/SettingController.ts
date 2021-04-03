import * as app from '.';
import * as ncm from '@nestjs/common';
import * as nsg from '@nestjs/swagger';

@ncm.Controller('api/setting')
@nsg.ApiTags('setting')
@nsg.ApiBadRequestResponse()
@nsg.ApiInternalServerErrorResponse()
export class SettingController {
  private readonly settingService: app.SettingService;

  constructor(settingService: app.SettingService) {
    this.settingService = settingService;
  }

  @app.ResponseValidator(app.api.SettingCore)
  @ncm.Get()
  @nsg.ApiResponse({status: 200, type: app.api.SettingCore})
  coreGet() {
    return app.settings.core;
  }

  @ncm.Put()
  @ncm.HttpCode(204)
  async corePutAsync(@ncm.Body() model: app.api.SettingCore) {
    await this.settingService.coreAsync(model);
  }

  @app.ResponseValidator(app.api.SettingCredential)
  @ncm.Get('credential')
  @nsg.ApiResponse({status: 200, type: app.api.SettingCredential})
  credentialGet() {
    return app.settings.credential;
  }

  @ncm.Put('credential')
  @ncm.HttpCode(204)
  async credentialPutAsync(@ncm.Body() model: app.api.SettingCredential) {
    await this.settingService.credentialAsync(model);
  }
  
  @app.ResponseValidator(app.api.SettingPath)
  @ncm.Get('path')
  @nsg.ApiResponse({status: 200, type: app.api.SettingPath})
  pathGet() {
    return app.settings.path;
  }

  @ncm.Put('path')
  @ncm.HttpCode(204)
  async pathPutAsync(@ncm.Body() model: app.api.SettingPath) {
    await this.settingService.pathAsync(model);
  }
}
