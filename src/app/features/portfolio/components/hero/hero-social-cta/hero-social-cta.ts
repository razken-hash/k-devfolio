import { Component, ChangeDetectionStrategy } from '@angular/core';


import { RouterModule } from '@angular/router';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TranslateModule } from '@ngx-translate/core';

import { CvPreview } from '../../cv-preview/cv-preview';

import { NavigationLink } from '../../../../../shared/models/navigation-link.model';
import { NavigationLinksService } from '../../../../../core/services/navigation-links.service';

@Component({
  selector: 'app-hero-social-cta',
  imports: [
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    CvPreview
],
  changeDetection: ChangeDetectionStrategy.Eager,
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