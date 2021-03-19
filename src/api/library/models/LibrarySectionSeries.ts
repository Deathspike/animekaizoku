import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibrarySectionSeries {
  constructor(source?: LibrarySectionSeries, sourcePatch?: Partial<LibrarySectionSeries>) {
    this.addedAt = api.property('addedAt', source, sourcePatch, 0);
    this.episodeAddedAt = api.property('episodeAddedAt', source, sourcePatch, undefined);
    this.episodeProgressAt = api.property('episodeProgressAt', source, sourcePatch, undefined);
    this.episodeWatchedAt = api.property('episodeWatchedAt', source, sourcePatch, undefined);
    this.genres = api.property('genres', source, sourcePatch, []);
    this.title = api.property('title', source, sourcePatch, '');
    this.unwatchedCount = api.property('unwatchedCount', source, sourcePatch, 0);
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
  readonly episodeAddedAt?: number;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly episodeProgressAt?: number;

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly episodeWatchedAt?: number;

  @clv.IsArray()
  @clv.IsString({each: true})
  @clv.IsNotEmpty({each: true})
  @nsg.ApiProperty()
  readonly genres: Array<string>;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly title: string;

  @clv.IsNumber()
  @clv.Min(0)
  @nsg.ApiProperty()
  readonly unwatchedCount: number;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly url: string;
}
