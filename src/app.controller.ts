import {
  Controller,
  Post,
  HttpCode,
  Body,
  Get,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { UrlService } from './url/url.service';
import { CreateUrlDto, EncodedUrlDto } from './url/url.dto';
import { Request } from 'express';
import * as geoip from 'geoip-lite';
import * as useragent from 'useragent';

@Controller()
export class AppController {
  constructor(private readonly urlService: UrlService) {}

  @Post('encode')
  @HttpCode(200)
  encodeUrl(@Body() createUrlDto: CreateUrlDto): EncodedUrlDto {
    const shortUrl = this.urlService.encode(createUrlDto.url);
    return { shortUrl };
  }
  @Get('decode/:urlPath')
  decodeUrl(
    @Param('urlPath') urlPath: string,
  ): { originalUrl: string } | { error: string } {
    const originalUrl = this.urlService.decode(urlPath);
    if (!originalUrl) {
      return { error: 'URL not found.' };
    }
    return { originalUrl };
  }
  @Get('statistic/:urlPath')
  getUrlStatistics(
    @Param('urlPath') urlPath: string,
  ): { originalUrl: string; accessCount: number } | { error: string } {
    const stats = this.urlService.getStatistics(urlPath);
    if (!stats) {
      return { error: 'URL not found.' };
    }
    return stats;
  }

  @Get(':urlPath')
  @Redirect()
  async redirectToOriginalUrl(
    @Param('urlPath') urlPath: string,
    @Req() request: Request,
  ) {
    const originalUrl = this.urlService.decode(urlPath);
    if (originalUrl) {
      const ipAddress = request.ip || request.socket.remoteAddress;
      const geo = geoip.lookup(ipAddress);
      const country = geo?.country;
      const ua = useragent.lookup(request.headers['user-agent']);
      const browser = ua.family;

      this.urlService.recordAccess(urlPath, ipAddress, country, browser);

      return { url: originalUrl, statusCode: 302 };
    }

    return { url: '/error-page', statusCode: 404 };
  }
}
