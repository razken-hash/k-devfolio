import { Component } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faFile, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn, faMedium } from '@fortawesome/free-brands-svg-icons';
import { CvPreview } from '../cv-preview/cv-preview';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule, FontAwesomeModule, CvPreview, TranslateModule],
  providers: [LowerCasePipe],
  templateUrl: './hero.html',
  styles: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
        opacity: 0;
      }
      50% {
        transform: translateY(-30px);
        opacity: 0.3;
      }
    }

    .animate-float {
        animation: float ease-in -out infinite;
    }
  `,
})
export class Hero {
  faArrowRight = faArrowRight;
  faFile = faFile;
  faGithub = faGithub;
  faLinkedinIn = faLinkedinIn;
  faMedium = faMedium;
  faDownload = faDownload;

  // Generate floating particles
  floatingParticles = Array(30).fill(0).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5
  }));

  constructor(private translateService: TranslateService, private sanitizer: DomSanitizer, private lowerCasePipe: LowerCasePipe) { }

  get heroTagHtml() {
    const modern = this.translateService.instant('HERO.MODERN_WEB_APPS');
    const exceptional = this.translateService.instant('HERO.EXCEPTIONAL_USER_EXPERIENCE');

    return this.translateService.instant('HERO.HERO_TAG', {
      MODERN_WEB_APPS: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(modern)}</span>`,
      EXCEPTIONAL_USER_EXPERIENCE: `<span class="text-lime-400 font-semibold">${this.lowerCasePipe.transform(exceptional)}</span>`
    }) + ".";
  }
}