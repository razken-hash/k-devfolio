import { LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-description',
  imports: [UpperCasePipe, TranslateModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './hero-description.html',
})
export class HeroDescription {

  constructor(private translateService: TranslateService, private lowerCasePipe: LowerCasePipe) { }

  get heroTagHtml() {
    const modern = this.translateService.instant('HERO.MODERN_WEB_APPS');
    const exceptional = this.translateService.instant('HERO.EXCEPTIONAL_USER_EXPERIENCE');

    return this.translateService.instant('HERO.HERO_TAG', {
      MODERN_WEB_APPS: `<span class="text-accent font-semibold">${this.lowerCasePipe.transform(modern)}</span>`,
      EXCEPTIONAL_USER_EXPERIENCE: `<span class="text-accent font-semibold">${this.lowerCasePipe.transform(exceptional)}</span>`
    }) + ".";
  }
}
