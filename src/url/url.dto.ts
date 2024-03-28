import { IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @IsString()
  url: string;
}

export class EncodedUrlDto {
  shortUrl: string;
}
