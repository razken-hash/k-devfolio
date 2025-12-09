import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LanguageService } from './language-service';

@Injectable({ providedIn: 'root' })
export class LanguageResolver implements Resolve<void> {
    constructor(private languageService: LanguageService) { }

    resolve(route: ActivatedRouteSnapshot): void {
        const code = route.paramMap.get('languageCode');
        if (code) {
            this.languageService.setLanguage(code);
        }
    }
}
