import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  DailyVisitStat,
  VisitResponseDto,
} from '../../../../shared/models/visit.model';
import { VisitsService } from '../../../../core/services/visits.service';
import { DonutChartComponent, DonutDatum } from '../../components/donut-chart/donut-chart';

@Component({
  selector: 'app-visit-analytics',
  standalone: true,
  imports: [DatePipe, DecimalPipe, DonutChartComponent],
  templateUrl: './visit-analytics.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block min-w-0 respect-reduced-motion' },
})
export class VisitAnalyticsComponent {
  // --------------------------------------------------
  // Sample data
  // Replace this array with your API response.
  // --------------------------------------------------

  private readonly visitService = inject(VisitsService);

  visits: VisitResponseDto[] = [];

  ngOnInit(): void {
    this.visitService.getVisits().subscribe({
      next: (visits) => {
        this.visits = visits;
        this.buildChart();
        this.buildDeviceStats();
        this.buildCountryStats();
        this.buildDisplayIds();
      },
      error: (error) => {
        console.error('Failed to load visits:', error);
      },
    });
  }

  // --------------------------------------------------
  // Summary statistics
  // --------------------------------------------------

  get totalVisits(): number {
    return this.visits.length;
  }

  get uniqueVisitors(): number {
    return new Set(
      this.visits
        .map((visit) => visit.visitorId)
        .filter((id): id is string => id !== null),
    ).size;
  }

  get uniquePages(): number {
    return new Set(this.visits.map((visit) => visit.path)).size;
  }

  get mobileVisits(): number {
    return this.visits.filter(
      (visit) => visit.deviceType?.toLowerCase() === 'mobile',
    ).length;
  }

  get mobilePercentage(): number {
    return this.totalVisits
      ? Math.round((this.mobileVisits / this.totalVisits) * 100)
      : 0;
  }

  // --------------------------------------------------
  // Daily visit chart
  // Built once when data (or the range) changes, so the bars
  // are not recreated on every change-detection pass.
  // --------------------------------------------------

  readonly chartRanges = [7, 30] as const;
  chartRange: 7 | 30 = 7;
  chartData: DailyVisitStat[] = [];
  chartMax = 1;
  chartTotal = 0;
  /** Horizontal guide values, top → bottom (excluding 0). */
  chartTicks: number[] = [];

  setChartRange(range: 7 | 30): void {
    if (this.chartRange !== range) {
      this.chartRange = range;
      this.buildChart();
    }
  }

  private buildChart(): void {
    const counts = new Map<string, number>();

    for (const visit of this.visits) {
      const visitDate = new Date(visit.visitedAt);

      if (!Number.isNaN(visitDate.getTime())) {
        const key = this.toDateKey(visitDate);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labelFormat = new Intl.DateTimeFormat('en', {
      weekday: this.chartRange === 7 ? 'short' : undefined,
      day: this.chartRange === 7 ? undefined : 'numeric',
      month: this.chartRange === 7 ? undefined : 'short',
    });
    const fullFormat = new Intl.DateTimeFormat('en', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const days: DailyVisitStat[] = [];

    for (let offset = this.chartRange - 1; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      const key = this.toDateKey(date);

      days.push({
        date: key,
        label: labelFormat.format(date),
        fullLabel: fullFormat.format(date),
        count: counts.get(key) ?? 0,
      });
    }

    const max = Math.max(...days.map((day) => day.count), 0);
    // Round the scale up to a "nice" number so guide lines are readable
    const step = max <= 4 ? 1 : Math.ceil(max / 4);
    this.chartMax = Math.max(step * 4, 1);
    this.chartTicks = max <= 4 && max > 0
      ? Array.from({ length: this.chartMax }, (_, i) => this.chartMax - i)
      : [4, 3, 2, 1].map((i) => i * step);
    this.chartTotal = days.reduce((sum, day) => sum + day.count, 0);
    this.chartData = days;
  }

  getBarHeight(count: number): number {
    return (count / this.chartMax) * 100;
  }

  /** Show every label for 7 days, roughly every 5th for 30 days. */
  showDayLabel(index: number): boolean {
    return this.chartRange === 7
      || index % 5 === (this.chartRange - 1) % 5;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // --------------------------------------------------
  // Device breakdown
  // --------------------------------------------------

  // Computed once when data loads (not a getter), so the charts
  // are not rebuilt on every change-detection pass.
  // Each entity keeps a fixed color slot, so colors never shift with rank.
  deviceStats: DonutDatum[] = [];
  countryStats: DonutDatum[] = [];

  private static readonly DEVICE_SLOTS: Record<string, number> = {
    Desktop: 1,
    Mobile: 2,
    Tablet: 3,
  };

  private static readonly COUNTRY_SLOTS: Record<string, number> = {
    France: 1,
    Algeria: 3,
    'Other countries': 2,
  };

  /**
   * Visits do not store a country, so it is inferred from the browser's
   * IANA time zone. Zones that do not identify any place (UTC, Etc/*,
   * missing) are counted as "Unknown" — typically bots or privacy browsers.
   */
  private static readonly COUNTRY_TIME_ZONES: Record<string, string> = {
    'Europe/Paris': 'France',
    'Africa/Algiers': 'Algeria',
  };

  private buildDeviceStats(): void {
    const slots = VisitAnalyticsComponent.DEVICE_SLOTS;
    const counts = new Map<string, number>(
      [...Object.keys(slots), 'Unknown'].map((name) => [name, 0]),
    );

    for (const visit of this.visits) {
      const device = visit.deviceType?.trim().toLowerCase();
      const name = Object.keys(slots).find((key) => key.toLowerCase() === device) ?? 'Unknown';
      counts.set(name, counts.get(name)! + 1);
    }

    this.deviceStats = this.toStats(counts, slots)
      // Only list "Unknown" when some visits actually fall into it.
      .filter((stat) => stat.name !== 'Unknown' || stat.count > 0);
  }

  /** Breakdown by country (inferred from the time zone), fixed order. */
  private buildCountryStats(): void {
    const slots = VisitAnalyticsComponent.COUNTRY_SLOTS;
    const zones = VisitAnalyticsComponent.COUNTRY_TIME_ZONES;
    const counts = new Map<string, number>(
      [...Object.keys(slots), 'Unknown'].map((name) => [name, 0]),
    );

    for (const visit of this.visits) {
      const zone = visit.timeZone?.trim() ?? '';
      const name =
        zones[zone] ??
        (!zone.includes('/') || zone.startsWith('Etc/') ? 'Unknown' : 'Other countries');
      counts.set(name, counts.get(name)! + 1);
    }

    this.countryStats = this.toStats(counts, slots)
      // Only list "Unknown" when some visits actually fall into it.
      .filter((stat) => stat.name !== 'Unknown' || stat.count > 0);
  }

  private toStats(counts: Map<string, number>, slots: Record<string, number>): DonutDatum[] {
    return [...counts].map(([name, count]) => ({
      name,
      count,
      slot: slots[name] ?? 0,
      percentage: this.totalVisits
        ? Math.round((count / this.totalVisits) * 100)
        : 0,
    }));
  }

  // --------------------------------------------------
  // Display IDs
  // Sequential, zero-padded numbers shown in the table instead of
  // the UUIDs (the real IDs are left untouched). The oldest visit
  // is #1; the width grows with the total (2 digits under 100,
  // 3 under 1000, ...).
  // --------------------------------------------------

  private displayIds = new Map<string, string>();

  private buildDisplayIds(): void {
    const width = Math.max(2, String(this.visits.length).length);

    const chronological = [...this.visits].sort(
      (a, b) =>
        new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime(),
    );

    this.displayIds = new Map(
      chronological.map((visit, index) => [
        visit.id,
        String(index + 1).padStart(width, '0'),
      ]),
    );
  }

  getDisplayId(visit: VisitResponseDto): string {
    return this.displayIds.get(visit.id) ?? '—';
  }

  // --------------------------------------------------
  // Table helpers
  // --------------------------------------------------

  trackByVisitId(
    _index: number,
    visit: VisitResponseDto,
  ): string {
    return visit.id;
  }

  getDeviceClass(deviceType: string | null): string {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return 'bg-accent/10 text-accent border border-accent/30';

      case 'mobile':
        return 'bg-primary/10 text-primary border border-primary/30';

      case 'tablet':
        return 'bg-secondary/10 text-secondary border border-secondary/30';

      default:
        return 'bg-overlay/10 text-fg-muted border border-overlay/20';
    }
  }
}