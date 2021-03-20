import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryContentSeriesEpisode {
  constructor(source?: LibraryContentSeriesEpisode, sourcePatch?: Partial<LibraryContentSeriesEpisode>) {
    this.currentTime = api.property('currentTime', source, sourcePatch, undefined);
    this.hasWatched = api.property('hasWatched', source, sourcePatch, false);
  }

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly currentTime?: number;

  @clv.IsBoolean()
  @nsg.ApiProperty()
  readonly hasWatched: boolean;
}
