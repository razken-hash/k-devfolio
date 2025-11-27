import { Injectable } from '@angular/core';
import { NavigationLink } from '../models/navigation-link.model';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class NavigationLinksService {
  navigationLinks: NavigationLink[] = [
    { label: 'Accueil', icon: null, url: 'welcome' },
    { label: 'Education', icon: null, url: 'education' },
    { label: 'Projets', icon: null, url: 'projects' },
    { label: 'Compétences', icon: null, url: 'skills' },
    { label: 'Contact', icon: null, url: 'contact' }
  ];

  accountsLinks: NavigationLink[] = [
    { label: 'GitHub', icon: faGithub, url: 'https://github.com/razken-hash', },
    { label: 'LinkedIn', icon: faLinkedin, url: 'https://www.linkedin.com/in/abderrazak-kenniche-a1a213227/', },
    { label: 'Email', icon: faEnvelope, url: 'mailto:pro.contactabderrazak@gmail.com', }
  ];
}
