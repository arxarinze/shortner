import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UrlEntry } from './url.interface';

@Injectable()
export class UrlService {
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

    return `http://localhost:3000/${urlPath}`;
  }
}
