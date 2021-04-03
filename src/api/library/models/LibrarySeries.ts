import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class LibrarySeries {
  constructor(source?: LibrarySeries, sourcePatch?: Partial<LibrarySeries>) {
    this.addedAt = api.property('addedAt', source, sourcePatch, 0);
    this.automation = api.property('automation', source, sourcePatch, undefined);
    this.episodeAddedAt = api.property('episodeAddedAt', source, sourcePatch, undefined);
    this.episodeProgressAt = api.property('episodeProgressAt', source, sourcePatch, undefined);
    this.episodeWatchedAt = api.property('episodeWatchedAt', source, sourcePatch, undefined);
    this.genres = api.property('genres', source, sourcePatch, []);
    this.imageUrl = api.property('imageUrl', source, sourcePatch, undefined);
    this.seasons = api.property('seasons', source, sourcePatch, []);
    this.synopsis = api.property('synopsis', source, sourcePatch, '');
    this.title = api.property('title', source, sourcePatch, '');
    this.url = api.property('url', source, sourcePatch, '');
  }

  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiProperty()
  readonly addedAt: number;

  @clv.IsOptional()
  @clv.ValidateNested()
  @clt.Type(() => api.LibrarySeriesAutomation)
  @nsg.ApiPropertyOptional({type: api.LibrarySeriesAutomation})
  readonly automation?: api.LibrarySeriesAutomation;

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

  @clv.IsOptional()
  @clv.IsString()
  @clv.IsUrl({require_tld: false})
  @nsg.ApiPropertyOptional()
  readonly imageUrl?: string;

  @clv.IsArray()
  @clv.ValidateNested()
  @clt.Type(() => api.LibrarySeriesSeason)
  @nsg.ApiProperty({type: [api.LibrarySeriesSeason]})
  readonly seasons: Array<api.LibrarySeriesSeason>;

  @clv.IsOptional()
  @clv.IsString()
  @nsg.ApiPropertyOptional()
  readonly synopsis?: string;
  
  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly title: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly url: string;
}
