import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibrarySeriesSeasonEpisode {
  constructor(source?: LibrarySeriesSeasonEpisode, sourcePatch?: Partial<LibrarySeriesSeasonEpisode>) {
    this.currentTime = api.property('currentTime', source, sourcePatch, undefined);
    this.hasWatched = api.property('hasWatched', source, sourcePatch, false);
    this.imageUrl = api.property('imageUrl', source, sourcePatch, undefined);
    this.title = api.property('title', source, sourcePatch, '');
    this.url = api.property('url', source, sourcePatch, '');
  }

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly currentTime?: number;

  @clv.IsBoolean()
  @nsg.ApiProperty()
  readonly hasWatched: boolean;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsUrl({require_tld: false})
  @nsg.ApiPropertyOptional()
  readonly imageUrl?: string;

  @clv.IsOptional()
  @clv.IsString()
  @nsg.ApiPropertyOptional()
  readonly title?: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly url: string;
}
