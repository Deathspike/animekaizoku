import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryContentSection {
  constructor(source?: LibraryContentSection, sourcePatch?: Partial<LibraryContentSection>) {
    this.url = api.property('url', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly url: string;
}
