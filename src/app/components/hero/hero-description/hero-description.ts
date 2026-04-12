import { CommonModule, LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-description',
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero-description.html',
})
export class HeroDescription {

  constructor(private translateService: TranslateService, private lowerCasePipe: LowerCasePipe) { }

  get heroTagHtml() {
    const modern = this.translateService.instant('HERO.MODERN_WEB_APPS');
    const exceptional = this.translateService.instant('HERO.EXCEPTIONAL_USER_EXPERIENCE');

    return this.translateService.instant('HERO.HERO_TAG', {
      MODERN_WEB_APPS: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(modern)}</span>`,
      EXCEPTIONAL_USER_EXPERIENCE: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(exceptional)}</span>`
    }) + ".";
  }
}
