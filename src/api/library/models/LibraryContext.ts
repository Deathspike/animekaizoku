import * as api from '../..';
import * as clv from 'class-validator';
import * as clt from 'class-transformer';
import * as nsg from '@nestjs/swagger';

@clv.ValidatorConstraint()
export class LibraryContext {
  constructor(source?: LibraryContext, sourcePatch?: Partial<LibraryContext>) {
    this.sections = api.property('sections', source, sourcePatch, []);
    this.version = api.property('version', source, sourcePatch, 0);
  }

  validate?(value: Array<api.LibraryContextSection>) {
    return value.every((x, xi) => {
      const lowerName = x.name.toLowerCase();
      return value.every((y, yi) => xi === yi || lowerName !== y.name.toLowerCase())
    });
  }

  @clv.IsArray()
  @clv.ArrayNotEmpty()
  @clv.ValidateNested()
  @clv.Validate(LibraryContext)
  @clt.Type(() => api.LibraryContextSection)
  @nsg.ApiProperty({type: [api.LibraryContextSection]})
  readonly sections: Array<api.LibraryContextSection>;

  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiProperty()
  readonly version: number;
}
