import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NavigationLink } from '../../models/navigation-link.model';
import { Language } from '../../models/language.model';
import { NavigationLinksService } from '../../services/navigation-links-service';
import { LanguageService } from '../../services/language-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule],
  templateUrl: './header.html',
  styles: `
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
  `,
})
export class Header {
  mobileMenuOpen = false;
  languageMenuOpen = false;

  faGlobe = faGlobe;

  constructor(private navigationLinksService: NavigationLinksService, private languageService: LanguageService, private router: Router) {
    this.naivigationLinks = this.navigationLinksService.navigationLinks;
    this.accountsLinks = this.navigationLinksService.accountsLinks;
    this.availableLanguages = this.languageService.languages;
  }

  naivigationLinks: NavigationLink[];
  accountsLinks: NavigationLink[];

  availableLanguages: Language[];

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleLanguageMenu(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  get currentLanguage(): string {
    return this.languageService.currentLanguage.code;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const languageButton = document.getElementById('language-button');
    const languageMenu = document.getElementById('language-menu');

    if (languageButton && languageMenu) {
      if (!languageButton.contains(target) && !languageMenu.contains(target)) {
        this.languageMenuOpen = false;
      }
    }
  }

  scrollTo(id: string) {
    if (id.includes('/')) {
      console.log('Navigating directly to', id);
      this.router.navigate([id]).then(() => {
        setTimeout(() => doScroll(), 150); // wait for DOM to render
      });

      return;
    }

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


  changeLanguage(code: string) {
    this.languageService.setLanguage(code);
    this.toggleLanguageMenu();
  }

  currentYear(): number {
    return new Date().getFullYear();
  }

}