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

  describe('decode', () => {
    it('should return the original URL for a known short URL', () => {
      const originalUrl = 'http://example.com';
      const shortUrl = service.encode(originalUrl);
      const urlPath = shortUrl.replace('http://localhost:3000/', '');
      expect(service.decode(urlPath)).toEqual(originalUrl);
    });

    it('should return null for an unknown short URL', () => {
      expect(service.decode('unknown')).toBeNull();
    });
  });
  describe('getStatistics', () => {
    it('should return statistics for a known URL', () => {
      const originalUrl = 'http://example.com';
      const shortUrl = service.encode(originalUrl);
      const urlPath = shortUrl.replace('http://localhost:3000/', '');
      service.decode(urlPath);

      const stats = service.getStatistics(urlPath);
      expect(stats).toEqual({
        originalUrl: originalUrl,
        accessCount: 1,
        accessRecords: expect.any(Array),
      });
    });

    it('should return null for an unknown URL', () => {
      expect(service.getStatistics('unknown')).toBeNull();
    });
  });
});
