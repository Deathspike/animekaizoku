import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class LibraryContentSeries {
  constructor(source?: LibraryContentSeries, sourcePatch?: Partial<LibraryContentSeries>) {
    this.automation = api.property('automation', source, sourcePatch, undefined);
  }

  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => api.LibraryContentSeriesAutomation)
  @nsg.ApiPropertyOptional({type: api.LibraryContentSeriesAutomation})
  readonly automation?: api.LibraryContentSeriesAutomation;
}
