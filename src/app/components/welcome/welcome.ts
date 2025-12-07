import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faFile, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn, faMedium } from '@fortawesome/free-brands-svg-icons';
import { CvPreview } from '../cv-preview/cv-preview';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, RouterModule, FontAwesomeModule, CvPreview, TranslateModule],
  templateUrl: './welcome.html',
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
export class Welcome {
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