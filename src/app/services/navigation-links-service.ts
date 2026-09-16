import { Injectable } from '@angular/core';
import { NavigationLink } from '../models/navigation-link.model';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class NavigationLinksService {
  navigationLinks: NavigationLink[] = [
    { label: 'HERO.HOME', icon: null, url: 'hero' },
    { label: 'BLOG.BLOG', icon: null, url: '/blog' },
    { label: 'EDUCATION.EDUCATION', icon: null, url: 'education' },
    { label: 'PROJECTS.PROJECTS', icon: null, url: 'projects' },
    { label: 'SKILLS.SKILLS', icon: null, url: 'skills' },
    { label: 'CONTACT.CONTACT', icon: null, url: 'contact' }
  ];

  accountsLinks: NavigationLink[] = [
    {
      label: 'GitHub',
      icon: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/github/default.svg',
      url: 'https://github.com/razken-hash',
    },
    {
      label: 'LinkedIn',
      icon: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/linkedin/default.svg',
      url: 'https://www.linkedin.com/in/abderrazak-kenniche/',
    },
    {
      label: 'Medium',
      icon: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/medium/default.svg',
      url: 'https://medium.com/@pro.contactabderrazak',
    },
  ];
}
