import * as app from '.';
import * as ncm from '@nestjs/common';

export function ResponseValidator<T>(cls: Array<ncm.Type<T>> | ncm.Type<T>) {
  return ncm.UseInterceptors(new app.ResponseValidatorInterceptor(cls));
}
