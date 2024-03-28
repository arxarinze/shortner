import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { AccessRecord, UrlEntry } from './url.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(private configService: ConfigService) {}
  private readonly urlDatabase: Record<string, UrlEntry> = {};

  private generateHash(input: string): string {
    return createHash('sha256')
      .update(input)
      .digest('base64url')
      .substring(0, 8);
  }

  encode(originalUrl: string): string {
    let uniqueFound = false;
    let urlPath = this.generateHash(originalUrl);
    let attempt = 0;

    while (!uniqueFound) {
      if (!this.urlDatabase.hasOwnProperty(urlPath)) {
        this.urlDatabase[urlPath] = {
          originalUrl,
          accessCount: 0,
          accessRecords: [],
        };
        uniqueFound = true;
      } else {
        const alteredUrl = originalUrl + randomBytes(1).toString('hex');
        urlPath = this.generateHash(alteredUrl + String(attempt));
        attempt++;
      }
    }

    return `${this.configService.get<string>('BASE_URL') ?? 'http://localhost:3000'}/${urlPath}`;
  }

  decode(urlPath: string): string | null {
    const entry = this.urlDatabase[urlPath];
    if (entry) {
      entry.accessCount += 1;
      return entry.originalUrl;
    }
    return null;
  }

  getStatistics(urlPath: string): UrlEntry | null {
    const entry = this.urlDatabase[urlPath];
    if (entry) {
      return {
        originalUrl: entry.originalUrl,
        accessCount: entry.accessCount,
        accessRecords: entry.accessRecords,
      };
    }
    return null;
  }
  recordAccess(
    urlPath: string,
    ipAddress: string,
    country: string,
    browser: string,
  ): void {
    const entry = this.urlDatabase[urlPath];
    if (entry) {
      const accessRecord: AccessRecord = {
        ipAddress,
        country,
        browser,
        timestamp: new Date(),
      };
      entry.accessRecords.push(accessRecord);
      entry.accessCount += 1;
    }
  }
}
