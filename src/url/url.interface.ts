export interface UrlEntry {
  originalUrl: string;
  accessCount: number;
  accessRecords: AccessRecord[];
}

export interface AccessRecord {
  ipAddress: string;
  country?: string;
  browser: string;
  timestamp: Date;
}
