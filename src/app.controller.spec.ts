import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url/url.service';
import { AppController } from './app.controller';
import { Request } from 'express';
describe('AppController', () => {
  let controller: AppController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            encode: jest.fn(),
            decode: jest.fn(),
            getStatistics: jest.fn(),
            recordAccess: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    urlService = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encodeUrl', () => {
    it('should return a shortUrl', async () => {
      const url = 'http://example.com';
      const shortUrl = 'http://short.url/abc123';
      (urlService.encode as jest.Mock).mockReturnValue(shortUrl);

      expect(await controller.encodeUrl({ url: url })).toEqual({ shortUrl });
      expect(urlService.encode).toHaveBeenCalledWith(url);
    });
  });

  describe('decodeUrl', () => {
    it('should return original URL if found', async () => {
      const urlPath = 'abc123';
      const originalUrl = 'http://example.com';
      (urlService.decode as jest.Mock).mockReturnValue(originalUrl);

      expect(await controller.decodeUrl(urlPath)).toEqual({ originalUrl });
      expect(urlService.decode).toHaveBeenCalledWith(urlPath);
    });

    it('should return an error if URL not found', async () => {
      const urlPath = 'unknown';
      (urlService.decode as jest.Mock).mockReturnValue(null);

      expect(await controller.decodeUrl(urlPath)).toEqual({
        error: 'URL not found.',
      });
      expect(urlService.decode).toHaveBeenCalledWith(urlPath);
    });
  });
  describe('getUrlStatistics', () => {
    it('should return URL statistics if found', async () => {
      const urlPath = 'abc123';
      const stats = { originalUrl: 'http://example.com', accessCount: 42 };
      (urlService.getStatistics as jest.Mock).mockReturnValue(stats);

      expect(await controller.getUrlStatistics(urlPath)).toEqual(stats);
      expect(urlService.getStatistics).toHaveBeenCalledWith(urlPath);
    });

    it('should return an error if URL not found', async () => {
      const urlPath = 'unknown';
      (urlService.getStatistics as jest.Mock).mockReturnValue(null);

      expect(await controller.getUrlStatistics(urlPath)).toEqual({
        error: 'URL not found.',
      });
      expect(urlService.getStatistics).toHaveBeenCalledWith(urlPath);
    });
  });
  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL if found', async () => {
      const urlPath = 'abc123';
      const originalUrl = 'http://example.com';
      const requestMock = {
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.1' },
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;
      (urlService.decode as jest.Mock).mockReturnValue(originalUrl);

      const result = await controller.redirectToOriginalUrl(
        urlPath,
        requestMock,
      );

      expect(result).toEqual({ url: originalUrl, statusCode: 302 });
      expect(urlService.decode).toHaveBeenCalledWith(urlPath);
      expect(urlService.recordAccess).toHaveBeenCalledWith(
        urlPath,
        '127.0.0.1',
        undefined,
        'Other',
      );
    });

    it('should redirect to an error page if URL not found', async () => {
      const urlPath = 'unknown';
      const requestMock = {
        ip: '127.0.0.1',
        socket: { remoteAddress: '127.0.0.1' },
        headers: { 'user-agent': 'test-agent' },
      } as unknown as Request;
      (urlService.decode as jest.Mock).mockReturnValue(null);

      const result = await controller.redirectToOriginalUrl(
        urlPath,
        requestMock,
      );

      expect(result).toEqual({ url: '/error-page', statusCode: 404 });
      expect(urlService.decode).toHaveBeenCalledWith(urlPath);
      expect(urlService.recordAccess).not.toHaveBeenCalled();
    });
  });
});
