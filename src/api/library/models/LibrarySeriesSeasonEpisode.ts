import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibrarySeriesSeasonEpisode {
  constructor(source?: LibrarySeriesSeasonEpisode, sourcePatch?: Partial<LibrarySeriesSeasonEpisode>) {
    this.addedAt = api.property('addedAt', source, sourcePatch, 0);
    this.deletedAt = api.property('deletedAt', source, sourcePatch, undefined);
    this.downloadedAt = api.property('downloadedAt', source, sourcePatch, undefined);
    this.hasWatched = api.property('hasWatched', source, sourcePatch, undefined);
    this.watchTime = api.property('watchTime', source, sourcePatch, undefined);
    this.imageUrl = api.property('imageUrl', source, sourcePatch, undefined);
    this.isPremium = api.property('isPremium', source, sourcePatch, false);
    this.name = api.property('name', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
    this.url = api.property('url', source, sourcePatch, '');
  }

  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiProperty()
  readonly addedAt: number;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly deletedAt?: number;
  
  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly downloadedAt?: number;

  @clv.IsOptional()
  @clv.IsBoolean()
  @nsg.ApiPropertyOptional()
  readonly hasWatched?: boolean;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly watchTime?: number;

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsUrl({require_tld: false})
  @nsg.ApiPropertyOptional()
  readonly imageUrl?: string;

  @clv.IsBoolean()
  @nsg.ApiProperty()
  readonly isPremium: boolean;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly name: string;

  @clv.IsOptional()
  @clv.IsString()
  @nsg.ApiPropertyOptional()
  readonly title?: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly url: string;
}
