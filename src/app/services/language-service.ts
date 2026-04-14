import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models/language.model';


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  currentLanguage: Language;

  constructor(private translate: TranslateService) {
    const browserCode = navigator.language.split('-')[0];
    const matched = this.languages.find(l => l.code === browserCode);

    this.currentLanguage = matched ?? this.languages[0]; // fallback to 'fr'

    this.translate.setDefaultLang(this.currentLanguage.code);
    this.translate.use(this.currentLanguage.code);
  }

  setLanguage(code: string) {
    const lang = this.languages.find(l => l.code === code);
    if (lang) {
      this.currentLanguage = lang;
      this.translate.use(code); // update ngx-translate language
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
