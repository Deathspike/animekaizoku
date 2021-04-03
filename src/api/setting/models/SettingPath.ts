import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class SettingPath {
  constructor(source?: SettingPath, sourcePatch?: Partial<SettingPath>) {
    this.cache = api.property('cache', source, sourcePatch, '');
    this.chrome = api.property('chrome', source, sourcePatch, '');
    this.library = api.property('library', source, sourcePatch, '');
    this.logger = api.property('logger', source, sourcePatch, '');
    this.plugin = api.property('plugin', source, sourcePatch, '');
    this.sync = api.property('sync', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly cache: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly chrome: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly library: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly logger: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly plugin: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly sync: string;
}
