import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryContentSeriesEpisode {
  constructor(source?: LibraryContentSeriesEpisode, sourcePatch?: Partial<LibraryContentSeriesEpisode>) {
    this.hasWatched = api.property('hasWatched', source, sourcePatch, undefined);
    this.watchTime = api.property('watchTime', source, sourcePatch, undefined);
  }

  @clv.IsOptional()
  @clv.IsBoolean()
  @nsg.ApiPropertyOptional()
  readonly hasWatched?: boolean;
  
  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly watchTime?: number;
}
