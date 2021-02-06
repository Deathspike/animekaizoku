import * as app from '.';
import * as ncm from '@nestjs/common';
import express from 'express';

@ncm.Catch()
export class ServerError implements ncm.ExceptionFilter {
  catch(error: Error, host: ncm.ArgumentsHost) {
    const response: express.Response = host.switchToHttp().getResponse();
    if (error instanceof ncm.HttpException) {
      const message = error.stack ?? error.message;
      const statusCode = error.getStatus();
      const errors = app.api.unsafe(error.getResponse()).message;
      response.status(statusCode).json({statusCode, message, errors});
    } else {
      const message = error.stack ?? error.message;
      const statusCode = 500;
      response.status(statusCode).json({statusCode, message});
    }
  }
}