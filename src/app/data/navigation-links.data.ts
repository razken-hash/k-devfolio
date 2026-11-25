import { NavigationLink } from '../shared/models/navigation-link.model';

export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'HERO.HOME', icon: null, url: 'hero' },
  { label: 'EXPERIENCE.EXPERIENCE', icon: null, url: 'experience' },
  { label: 'EDUCATION.EDUCATION', icon: null, url: 'education' },
  { label: 'PROJECTS.PROJECTS', icon: null, url: '/projects' },
  { label: 'BLOG.BLOG', icon: null, url: '/blog' },
  { label: 'CONTACT.CONTACT', icon: null, url: 'contact' }
];

export const ACCOUNT_LINKS: NavigationLink[] = [
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
