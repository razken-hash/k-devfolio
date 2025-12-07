import { Injectable } from '@angular/core';
import { Language } from '../models/language.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  languages: Language[] = [
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'EN', name: 'English', flag: '🇬🇧' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'TR', name: 'Türkçe', flag: '🇹🇷' }
  ];

  currentLanguage: Language = this.languages[0];
}
