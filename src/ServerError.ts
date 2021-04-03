import * as app from './shared';
import * as ncm from '@nestjs/common';
import express from 'express';

@ncm.Catch()
export class ServerError implements ncm.ExceptionFilter {
  private readonly loggerService: app.LoggerService;

  constructor(loggerService: app.LoggerService) {
    this.loggerService = loggerService;
  }

  catch(error: Error, host: ncm.ArgumentsHost) {
    const request: express.Request = host.switchToHttp().getRequest();
    const response: express.Response = host.switchToHttp().getResponse();
    if (error instanceof app.ValidationError) {
      const message = error.stack ?? error.message;
      const statusCode = 409;
      const value = {statusCode, message, ...error.data};
      response.status(statusCode).json(value);
      this.loggerService.debug(`HTTP/${request.httpVersion} ${statusCode} ${JSON.stringify(value)}`);
    } else if (error instanceof app.StatusCodeError) {
      const message = error.stack ?? error.message;
      const statusCode = error.getStatus();
      const value = {statusCode, message};
      response.status(statusCode).json(value);
      this.loggerService.debug(`HTTP/${request.httpVersion} ${statusCode} ${JSON.stringify(value)}`);
    } else {
      const message = error && (error.stack ?? error.message);
      const statusCode = 500;
      const value = {statusCode, message};
      response.status(statusCode).json(value);
      this.loggerService.debug(`HTTP/${request.httpVersion} ${statusCode} ${JSON.stringify(value)}`);
      this.loggerService.error(message);
    }
  }
}
