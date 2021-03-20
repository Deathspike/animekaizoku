import * as app from '.';
import * as ncm from '@nestjs/common';
import bodyParser from 'body-parser';
import cors from 'cors'

@ncm.Module({
  controllers: [app.LibraryController],
  providers: []})
export class LibraryModule implements ncm.NestModule {
  configure(consumer: ncm.MiddlewareConsumer) {
    consumer.apply(bodyParser.json()).forRoutes(app.LibraryController);
    consumer.apply(cors()).forRoutes('api/library');
  }
}
