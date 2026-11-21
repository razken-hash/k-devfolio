import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../shared/models/language.model';


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  static languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  currentLanguage: Language;

  constructor(private translate: TranslateService) {
    const websiteLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];

    this.currentLanguage = LanguageService.languages.find(l => l.code === websiteLanguage) || LanguageService.languages[0]; // fallback to 'en'
    document.documentElement.lang = this.currentLanguage.code; // update HTML lang attribute

    this.translate.setDefaultLang(this.currentLanguage.code);
    this.translate.use(this.currentLanguage.code);
  }

  setLanguage(code: string) {
    const lang = LanguageService.languages.find(l => l.code === code);
    if (lang) {
      if (lang !== this.currentLanguage) {
        this.currentLanguage = lang;
        this.translate.use(code);
        document.documentElement.lang = code;
        localStorage.setItem('language', code);
      }
    }
  }

  getCurrentLanguageCode(): string {
    return this.currentLanguage.code;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.currentLanguage.code + "-" + this.currentLanguage.code.toUpperCase(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
