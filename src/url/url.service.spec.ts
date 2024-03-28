import { Test } from '@nestjs/testing';
import { UrlService } from './url.service';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encode', () => {
    it('should return a shortened URL and update the database', () => {
      const originalUrl = 'http://example.com';
      const shortUrl = service.encode(originalUrl);
      expect(shortUrl).toMatch(/^http:\/\/localhost:3000\/[A-Za-z0-9_-]{8}$/);

      const urlPath = shortUrl.replace('http://localhost:3000/', '');
      expect(service.decode(urlPath)).toEqual(originalUrl);
    });
  });
});
