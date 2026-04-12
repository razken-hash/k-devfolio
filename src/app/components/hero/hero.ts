import { Component } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faFile, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn, faMedium } from '@fortawesome/free-brands-svg-icons';
import { CvPreview } from '../cv-preview/cv-preview';
import { TranslateModule } from '@ngx-translate/core';
import { HeroPersonalPicture } from './hero-personal-picture/hero-personal-picture';
import { HeroDescription } from './hero-description/hero-description';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule, FontAwesomeModule, CvPreview, TranslateModule, HeroPersonalPicture, HeroDescription],
  providers: [LowerCasePipe],
  templateUrl: './hero.html',

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
}