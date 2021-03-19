import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class LibrarySeriesAutomation {
  constructor(source?: LibrarySeriesAutomation, sourcePatch?: Partial<LibrarySeriesAutomation>) {
    this.checkedAt = api.property('checkedAt', source, sourcePatch, undefined);
    this.nextAt = api.property('nextAt', source, sourcePatch, 0);
    this.repeat = api.property('repeat', source, sourcePatch, 'hourly');
    this.strategy = api.property('strategy', source, sourcePatch, 'none');
  }

  @clv.IsOptional()
  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiPropertyOptional()
  readonly checkedAt?: number;

  @clv.IsNumber()
  @clv.IsPositive()
  @nsg.ApiProperty()
  readonly nextAt: number;

  @clv.IsString()
  @clv.IsIn(['hourly', 'daily', 'weekly', 'monthly'])
  @nsg.ApiProperty({enum: ['hourly', 'daily', 'weekly', 'monthly']})
  readonly repeat: 'hourly' | 'daily' | 'weekly' | 'monthly'; 

  @clv.IsString()
  @clv.IsIn(['none', 'watched', 'unwatched', 'all'])
  @nsg.ApiProperty({enum: ['none', 'watched', 'unwatched', 'all']})
  readonly strategy: 'none' | 'watched' | 'unwatched' | 'all';
}
