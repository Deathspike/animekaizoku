import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryParamSeriesEpisode {
  constructor(source?: LibraryParamSeriesEpisode, sourcePatch?: Partial<LibraryParamSeriesEpisode>) {
    this.section = api.property('section', source, sourcePatch, '');
    this.seriesUrl = api.property('seriesUrl', source, sourcePatch, '');
    this.episodeUrl = api.property('episodeUrl', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly section: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly seriesUrl: string;

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly episodeUrl: string;
}
