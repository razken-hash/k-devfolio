
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { AnalyticsService } from './core/services/analytics.service';
import { VisitsService } from './core/services/visits.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class App {
  protected readonly title = signal('kDevfolio');

  constructor(
    private languageService: LanguageService,
    private analyticsService: AnalyticsService,
    private visitsService: VisitsService
  ) {
    this.visitsService.startTracking();
  }

  get currentLanguage() {
    return this.languageService.currentLanguage.code;
  }
}
