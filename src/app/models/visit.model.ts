export interface VisitResponseDto {
  id: string;
  visitedAt: string;
  visitorId: string | null;
  origin: string | null;
  path: string;
  pageTitle: string | null;
  deviceType: string | null;
  operatingSystem: string | null;
  platform: string | null;
  browser: string | null;
  browserLanguage: string | null;
  timeZone: string | null;
}

export interface DailyVisitStat {
  date: string;
  label: string;
  count: number;
}

export interface DeviceVisitStat {
  name: string;
  count: number;
  percentage: number;
}

export interface RecordVisitDto {
  visitorId: string;
  path: string;
  origin: string;
  pageTitle: string;
  deviceType: string;
  operatingSystem: string;
  platform: string;
  browser: string;
  browserLanguage: string;
  timeZone: string;
}
