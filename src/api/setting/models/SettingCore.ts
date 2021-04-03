import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class SettingCore {
  constructor(source?: SettingCore, sourcePatch?: Partial<SettingCore>) {
    this.cacheTimeoutPage = api.property('cacheTimeoutPage', source, sourcePatch, 0);
    this.cacheTimeoutSearch = api.property('cacheTimeoutSearch', source, sourcePatch, 0);
    this.cacheTimeoutSeries = api.property('cacheTimeoutSeries', source, sourcePatch, 0);
    this.cacheTimeoutStream = api.property('cacheTimeoutStream', source, sourcePatch, 0);
    this.chromeHeadless = api.property('chromeHeadless', source, sourcePatch, false);
    this.chromeTimeoutInactive = api.property('chromeTimeoutInactive', source, sourcePatch, 0);
    this.chromeTimeoutNavigation = api.property('chromeTimeoutNavigation', source, sourcePatch, 0);
    this.chromeViewport = api.property('chromeViewport', source, sourcePatch, '');
    this.fetchTimeout = api.property('fetchTimeout', source, sourcePatch, 0);
    this.proxyServer = api.property('proxyServer', source, sourcePatch, undefined);
  }

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly cacheTimeoutPage: number;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly cacheTimeoutSearch: number;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly cacheTimeoutSeries: number;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly cacheTimeoutStream: number;

  @clv.IsBoolean()
  @nsg.ApiProperty()
  readonly chromeHeadless: boolean;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly chromeTimeoutInactive: number;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly chromeTimeoutNavigation: number;

  @clv.IsString()
  @clv.Matches(/^[0-9]+x[0-9]+$/)
  @nsg.ApiProperty()
  readonly chromeViewport: string;

  @clv.IsNumber()
  @clv.IsPositive()
  @clt.Type(() => Number)
  @nsg.ApiProperty()
  readonly fetchTimeout: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.Matches(/^(http|https|nordvpn|socks|socks4|socks5)\:\/\/(?:(.+)\:(.+)@)?(?:.+)$/)
  @nsg.ApiPropertyOptional()
  readonly proxyServer?: string;
}
