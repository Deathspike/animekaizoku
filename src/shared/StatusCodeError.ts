import * as app from '.';
import * as ncm from '@nestjs/common';

export class StatusCodeError extends ncm.HttpException {
  private constructor(statusCode: number) {
    const message = '';
    super(message, statusCode);
  }

  static async open<T>(value: app.StatusCode | T) {
    switch (value) {
      case app.StatusCode.NotFound: throw new StatusCodeError(value);
      case app.StatusCode.Conflict: throw new StatusCodeError(value);
      default: return value;
    }
  }  
}
