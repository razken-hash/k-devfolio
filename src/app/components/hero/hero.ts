import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeroMobileHeader } from './hero-mobile-header/hero-mobile-header';
import { RouterModule } from '@angular/router';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CvPreview } from '../cv-preview/cv-preview';
import { HeroDescription } from './hero-description/hero-description';
import { HeroPersonalPicture } from './hero-personal-picture/hero-personal-picture';
import { HeroSocialCta } from './hero-social-cta/hero-social-cta';
import { faGithub, faLinkedinIn, faMedium } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faDownload, faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule, RouterModule, FontAwesomeModule, TranslateModule, HeroPersonalPicture, HeroDescription, HeroMobileHeader, HeroSocialCta   // ← add these
  ],
  providers: [LowerCasePipe],
  templateUrl: './hero.html',
})
export class Hero {
  // heroTagHtml needed for the mobile description paragraph
  constructor(private translateService: TranslateService, private lowerCasePipe: LowerCasePipe) { }

  get heroTagHtml() {
    const modern = this.translateService.instant('HERO.MODERN_WEB_APPS');
    const exceptional = this.translateService.instant('HERO.EXCEPTIONAL_USER_EXPERIENCE');
    return this.translateService.instant('HERO.HERO_TAG', {
      MODERN_WEB_APPS: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(modern)}</span>`,
      EXCEPTIONAL_USER_EXPERIENCE: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(exceptional)}</span>`
    }) + ".";
  }

  faArrowRight = faArrowRight;
  faFile = faFile;
  faGithub = faGithub;
  faLinkedinIn = faLinkedinIn;
  faMedium = faMedium;
  faDownload = faDownload;

  floatingParticles = Array(30).fill(0).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5
  }));
}