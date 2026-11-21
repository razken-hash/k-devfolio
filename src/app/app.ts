
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { AnalyticsService } from './core/services/analytics.service';
import { VisitsService } from './core/services/visits.service';
import { ThemeService } from './core/services/theme.service';

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
    private visitsService: VisitsService,
    // Instantiated at startup so the theme is applied on every route
    private themeService: ThemeService
  ) {
    this.visitsService.startTracking();
  }

  get currentLanguage() {
    return this.languageService.currentLanguage.code;
  }
}
