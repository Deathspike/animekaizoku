import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class LibrarySection {
  constructor(source?: LibrarySection, sourcePatch?: Partial<LibrarySection>) {
    this.name = api.property('name', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
    this.series = api.property('series', source, sourcePatch, []);
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly name: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly path: string;

  @clv.IsArray()
  @clv.ValidateNested()
  @clt.Type(() => api.LibrarySectionSeries)
  @nsg.ApiProperty({type: [api.LibrarySectionSeries]})
  readonly series: Array<api.LibrarySectionSeries>;
}
