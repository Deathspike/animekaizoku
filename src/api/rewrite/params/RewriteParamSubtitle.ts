import * as api from '../..';
import * as clv from 'class-validator';
import * as nsg from '@nestjs/swagger';

export class RewriteParamSubtitle {
  constructor(source?: RewriteParamSubtitle, sourcePatch?: Partial<RewriteParamSubtitle>) {
    this.subtitleUrl = api.property('subtitleUrl', source, sourcePatch, '');
    this.subtitleType = api.property('subtitleType', source, sourcePatch, 'ass');
  }

  @clv.IsString()
  @clv.IsUrl()
  @nsg.ApiProperty()
  readonly subtitleUrl: string;

  @clv.IsString()
  @clv.IsIn(['ass', 'vtt'])
  @nsg.ApiProperty({enum: ['ass', 'vtt']})
  readonly subtitleType: 'ass' | 'vtt';
}
