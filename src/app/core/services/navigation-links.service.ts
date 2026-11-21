import { Injectable } from '@angular/core';
import { NavigationLink } from '../../shared/models/navigation-link.model';
import { ACCOUNT_LINKS, NAVIGATION_LINKS } from '../../data/navigation-links.data';

@Injectable({
  providedIn: 'root',
})
export class NavigationLinksService {
  navigationLinks: NavigationLink[] = NAVIGATION_LINKS;

  accountsLinks: NavigationLink[] = ACCOUNT_LINKS;
}
