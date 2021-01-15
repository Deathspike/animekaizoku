import * as app from '../..';
import * as clv from 'class-validator';
import * as swg from '@nestjs/swagger';

export class RemoteStreamSubtitle {
  constructor(source?: RemoteStreamSubtitle, sourcePatch?: Partial<RemoteStreamSubtitle>) {
    this.language = app.property('language', source, sourcePatch, 'eng');
    this.type = app.property('type', source, sourcePatch, 'vtt');
    this.url = app.property('url', source, sourcePatch, '');
  }

  @clv.IsString()
  @clv.IsIn(['ara', 'fre', 'ger', 'ita', 'eng', 'por', 'rus', 'spa'])
  @swg.ApiProperty({enum: ['ara', 'fre', 'ger', 'ita', 'eng', 'por', 'rus', 'spa']})
  readonly language: 'ara' | 'fre' | 'ger' | 'ita' | 'eng' | 'por' | 'rus' | 'spa';

  @clv.IsString()
  @clv.IsIn(['ass', 'vtt'])
  @swg.ApiProperty({enum: ['ass', 'vtt']})
  readonly type: 'ass' | 'vtt';

  @clv.IsString()
  @clv.IsUrl({require_tld: false})
  @swg.ApiProperty()
  readonly url: string;
}