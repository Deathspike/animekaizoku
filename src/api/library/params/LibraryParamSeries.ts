import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryParamSeries {
  constructor(source?: LibraryParamSeries, sourcePatch?: Partial<LibraryParamSeries>) {
    this.section = api.property('section', source, sourcePatch, '');
    this.seriesUrl = api.property('seriesUrl', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly section: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly seriesUrl: string;
}
