import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlService } from './url/url.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UrlService],
})
export class AppModule {}
