import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class LibrarySeriesSeason {
  constructor(source?: LibrarySeriesSeason, sourcePatch?: Partial<LibrarySeriesSeason>) {
    this.episodes = api.property('episodes', source, sourcePatch, []);
    this.title = api.property('title', source, sourcePatch, '');
  }

  @clv.IsArray()
  @clv.ValidateNested()
  @clt.Type(() => api.LibrarySeriesSeasonEpisode)
  @nsg.ApiProperty({type: [api.LibrarySeriesSeasonEpisode]})
  readonly episodes: Array<api.LibrarySeriesSeasonEpisode>;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly title: string;
}
