import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn, faMedium } from '@fortawesome/free-brands-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { CvPreview } from '../../cv-preview/cv-preview';

@Component({
  selector: 'app-hero-social-cta',
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule, CvPreview],
  templateUrl: './hero-social-cta.html',
})
export class HeroSocialCta {
  faArrowRight = faArrowRight;
  faGithub = faGithub;
  faLinkedinIn = faLinkedinIn;
  faMedium = faMedium;
}