import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './services/language-service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kDevfolio');

  constructor(
    private languageService: LanguageService,
    private analyticsService: AnalyticsService) { }

  get currentLanguage() {
    return this.languageService.currentLanguage.code;
  }
}
