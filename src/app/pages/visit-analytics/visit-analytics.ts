import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  DeviceVisitStat,
  DailyVisitStat,
  VisitResponseDto,
} from '../../models/visit.model';
import { VisitsService } from '../../services/visits.service';

@Component({
  selector: 'app-visit-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visit-analytics.html',
  styleUrls: ['./visit-analytics.css'],
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
  // Uses the seven calendar days ending today.
  // --------------------------------------------------

  get chartData(): DailyVisitStat[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DailyVisitStat[] = [];

    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);

      const dateKey = this.toDateKey(date);

      const count = this.visits.filter((visit) => {
        const visitDate = new Date(visit.visitedAt);

        return !Number.isNaN(visitDate.getTime())
          && this.toDateKey(visitDate) === dateKey;
      }).length;

      days.push({
        date: dateKey,
        label: new Intl.DateTimeFormat('en', {
          weekday: 'short',
        }).format(date),
        count,
      });
    }

    return days;
  }

  get maxDailyVisits(): number {
    return Math.max(...this.chartData.map((day) => day.count), 1);
  }

  getBarHeight(count: number): number {
    if (count === 0) {
      return 0;
    }

    return Math.max((count / this.maxDailyVisits) * 100, 5);
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

  get deviceStats(): DeviceVisitStat[] {
    const categories = ['Desktop', 'Mobile', 'Tablet', 'Unknown'];

    return categories.map((name) => {
      const count = this.visits.filter((visit) => {
        const device = visit.deviceType?.toLowerCase();

        if (name === 'Unknown') {
          return !device || !categories
            .slice(0, 3)
            .some((category) => category.toLowerCase() === device);
        }

        return device === name.toLowerCase();
      }).length;

      return {
        name,
        count,
        percentage: this.totalVisits
          ? Math.round((count / this.totalVisits) * 100)
          : 0,
      };
    });
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
        return 'bg-emerald-100 text-emerald-800';

      case 'mobile':
        return 'bg-teal-100 text-teal-800';

      case 'tablet':
        return 'bg-lime-100 text-lime-800';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  }
}