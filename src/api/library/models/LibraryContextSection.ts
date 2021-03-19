import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibraryContextSection {
  constructor(source?: LibraryContextSection, sourcePatch?: Partial<LibraryContextSection>) {
    this.name = api.property('name', source, sourcePatch, '');
    this.path = api.property('path', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly name: string;

  @clv.IsString()
  @clv.IsNotEmpty()
  @nsg.ApiProperty()
  readonly path: string;
}
