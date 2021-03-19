import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

export class LibraryContext {
  constructor(source?: LibraryContext, sourcePatch?: Partial<LibraryContext>) {
    this.sections = api.property('sections', source, sourcePatch, []);
    this.version = api.property('version', source, sourcePatch, 0);
  }

  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested()
  @clt.Type(() => api.LibraryContextSection)
  @nsg.ApiProperty({type: [api.LibraryContextSection]})
  readonly sections: Array<api.LibraryContextSection>;

  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiProperty()
  readonly version: number;
}
