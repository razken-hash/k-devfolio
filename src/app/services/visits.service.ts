import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../environment/environment';
import { RecordVisitDto, VisitResponseDto } from '../models/visit.model';





@Injectable({
  providedIn: 'root',
})
export class VisitsService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly apiUrl =
  `${environment.backendUrl}/analytics/visits`;
  
  getVisits(): Observable<VisitResponseDto[]> {
    return this.http.get<VisitResponseDto[]>(this.apiUrl);
  }
  
  private readonly visitorStorageKey = 'kdevfolio_visitor_id';
  private started = false;

  /**
   * Start tracking Angular page navigations.
   * Call once from the root component.
   */
  startTracking(): void {
    if (this.started || !this.document.defaultView) {
      return;
    }

    this.started = true;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = event as NavigationEnd;
        this.recordVisit(navigation.urlAfterRedirects);
      });
  }

  /**
   * Send a page-view event to the Spring Boot API.
   */
  private recordVisit(url: string): void {
    const payload = this.buildPayload(url);

    this.http
      .post<VisitResponseDto>(this.apiUrl, payload)
      .pipe(
        catchError((error) => {
          console.error(
            '[VisitsService] Failed to record visit:',
            error,
          );

          // Analytics failures must not disrupt the portfolio.
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          console.debug(
            '[VisitsService] Visit recorded:',
            response,
          );
        }
      });
  }

  /**
   * Build a payload matching the backend RecordVisitDto.
   */
  private buildPayload(url: string): RecordVisitDto {
    const win = this.document.defaultView!;

    return {
      visitorId: this.getVisitorId(),
      path: this.getPathWithoutQuery(url),
      origin: this.getOrigin(url),
      pageTitle: this.document.title,
      deviceType: this.getDeviceType(),
      operatingSystem: this.getOperatingSystem(),
      platform: win.navigator.platform || 'unknown',
      browser: this.getBrowser(),
      browserLanguage: win.navigator.language || 'unknown',
      timeZone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    };
  }

  /**
   * Read origin from the current URL.
   *
   * Examples:
   * /?origin=cv       -> cv
   * /?origin=linkedin -> linkedin
   * /                 -> direct
   */
  private getOrigin(url: string): string {
    const queryIndex = url.indexOf('?');

    if (queryIndex === -1) {
      return 'direct';
    }

    const query = url.slice(queryIndex + 1).split('#')[0];
    const params = new URLSearchParams(query);
    const origin = params.get('origin')?.trim().toLowerCase();

    if (!origin || !/^[a-z0-9_-]{1,50}$/.test(origin)) {
      return 'direct';
    }

    return origin;
  }

  /**
   * Generate or retrieve a persistent pseudonymous visitor UUID.
   */
  private getVisitorId(): string {
    const win = this.document.defaultView!;

    try {
      let visitorId = win.localStorage.getItem(
        this.visitorStorageKey,
      );

      if (!visitorId || !this.isValidUuid(visitorId)) {
        visitorId = win.crypto.randomUUID();

        win.localStorage.setItem(
          this.visitorStorageKey,
          visitorId,
        );
      }

      return visitorId;
    } catch {
      return win.crypto.randomUUID();
    }
  }

  private isValidUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  /**
   * Remove query parameters and fragments from the stored path.
   */
  private getPathWithoutQuery(url: string): string {
    return url.split(/[?#]/, 1)[0] || '/';
  }

  /**
   * Infer the broad device category from the user agent.
   */
  private getDeviceType(): string {
    const ua = this.document.defaultView!.navigator.userAgent;

    if (/iPad|Tablet/i.test(ua)) {
      return 'tablet';
    }

    if (/Mobi|Android/i.test(ua) && !/iPad/i.test(ua)) {
      return 'mobile';
    }

    return 'desktop';
  }

  /**
   * Infer the browser family.
   */
  private getBrowser(): string {
    const ua = this.document.defaultView!.navigator.userAgent;

    if (/Edg\//i.test(ua)) return 'Edge';
    if (/OPR\//i.test(ua)) return 'Opera';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/CriOS\//i.test(ua)) return 'Chrome iOS';
    if (/Chrome\//i.test(ua)) return 'Chrome';
    if (/FxiOS\//i.test(ua)) return 'Firefox iOS';
    if (/Safari\//i.test(ua)) return 'Safari';

    return 'Other';
  }

  /**
   * Infer the operating system family.
   */
  private getOperatingSystem(): string {
    const nav = this.document.defaultView!.navigator;
    const ua = nav.userAgent;

    if (/Windows/i.test(ua)) return 'Windows';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';

    return 'Other';
  }
}