import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NavigationLink } from '../../models/navigation-link.model';
import { NavigationLinksService } from '../../services/navigation-links-service';
import { LanguageService } from '../../services/language-service';
import { Technology } from '../../models/technology.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './footer.html',
  styles: ``,
})
export class Footer {

  faMoon = faMoon;
  faSun = faSun;
  faGithub = faGithub;
  faLinkedin = faLinkedin;
  naivigationLinks: NavigationLink[];
  accountsLinks: NavigationLink[];

  constructor(private navigationLinksService: NavigationLinksService, private languageService: LanguageService, private router: Router) {
    this.naivigationLinks = this.navigationLinksService.navigationLinks;
    this.accountsLinks = this.navigationLinksService.accountsLinks;
  }

  techStack: Technology[] = [
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' }
  ];

  scrollTo(id: string) {

    const doScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    };

    // If NOT on `/`, navigate first then scroll
    console.log('Current URL:', this.router.url);
    if (this.router.url !== '/') {
      console.log('Navigating to / first');
      this.router.navigate(['/']).then(() => {
        setTimeout(() => doScroll(), 150); // wait for DOM to render
      });
      return;
    }

    // Already on `/`, just scroll
    doScroll();
  }

}
