import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryParamSection {
  constructor(source?: LibraryParamSection, sourcePatch?: Partial<LibraryParamSection>) {
    this.section = api.property('section', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly section: string;
}
