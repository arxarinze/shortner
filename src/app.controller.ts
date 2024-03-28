import { Controller, Post, HttpCode, Body, Get, Param } from '@nestjs/common';
import { UrlService } from './url/url.service';
import { CreateUrlDto, EncodedUrlDto } from './url/url.dto';

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
}
