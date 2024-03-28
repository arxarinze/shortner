import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url/url.service';
import { AppController } from './app.controller';
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
});
