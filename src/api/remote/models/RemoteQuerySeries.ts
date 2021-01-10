import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class RemoteQuerySeries {
  @clv.IsString()
  @clv.IsUrl()
  @swg.ApiProperty()
  readonly seriesUrl!: string;
}