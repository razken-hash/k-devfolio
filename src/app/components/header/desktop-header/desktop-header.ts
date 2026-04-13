import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { NavigationLink } from '../../../models/navigation-link.model';
import { Language } from '../../../models/language.model';
import { BaseHeader } from '../base-header';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './desktop-header.html',
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class DesktopHeader extends BaseHeader {
  @Input() accountsLinks: NavigationLink[] = [];
  @Input() languageMenuOpen: boolean = false;

  @Output() languageMenuToggled = new EventEmitter<void>();

  faGlobe = faGlobe;

  toggleLanguageMenu(): void {
    this.languageMenuToggled.emit();
  }
}