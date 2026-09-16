import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TranslateModule } from '@ngx-translate/core';

import { CvPreview } from '../../cv-preview/cv-preview';

import { NavigationLink } from '../../../models/navigation-link.model';
import { NavigationLinksService } from '../../../services/navigation-links-service';

@Component({
  selector: 'app-hero-social-cta',
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    CvPreview,
  ],
  templateUrl: './hero-social-cta.html',
})
export class HeroSocialCta {

  faArrowRight = faArrowRight;

  accountsLinks: NavigationLink[];

  constructor(
    private navigationLinksService: NavigationLinksService
  ) {
    this.accountsLinks = this.navigationLinksService.accountsLinks;
  }
}