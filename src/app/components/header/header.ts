import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationLink } from '../../models/navigation-link.model';
import { Language } from '../../models/language.model';
import { NavigationLinksService } from '../../services/navigation-links-service';
import { LanguageService } from '../../services/language-service';
import { DesktopHeader } from './desktop-header/desktop-header';
import { MobileHeader } from './mobile-header/mobile-header';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, DesktopHeader, MobileHeader],
  templateUrl: './header.html',
})
export class Header {
  mobileMenuOpen = false;
  languageMenuOpen = false;

  navigationLinks: NavigationLink[];
  accountsLinks: NavigationLink[];
  availableLanguages: Language[];

  constructor(
    private navigationLinksService: NavigationLinksService,
    private languageService: LanguageService,
    private router: Router
  ) {
    this.navigationLinks = this.navigationLinksService.navigationLinks;
    this.accountsLinks = this.navigationLinksService.accountsLinks;
    this.availableLanguages = LanguageService.languages;
  }

  get currentLanguage(): string {
    return this.languageService.currentLanguage.code;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleLanguageMenu(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  changeLanguage(code: string): void {
    this.languageService.setLanguage(code);
    this.languageMenuOpen = false;
  }

  onMobileLinkClicked(url: string): void {
    this.mobileMenuOpen = false;
    this.scrollTo(url);
  }

  scrollTo(id: string): void {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    if (id.includes('/')) {
      this.router.navigate([id]).then(() => setTimeout(doScroll, 150));
      return;
    }

    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => setTimeout(doScroll, 150));
      return;
    }

    doScroll();
  }

  currentYear(): number {
    return new Date().getFullYear();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const btn = document.getElementById('language-button');
    const menu = document.getElementById('language-menu');
    if (btn && menu && !btn.contains(target) && !menu.contains(target)) {
      this.languageMenuOpen = false;
    }
  }
}