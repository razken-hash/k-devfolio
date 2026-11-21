import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { NavigationLink } from '../../../../shared/models/navigation-link.model';
import { Language } from '../../../../shared/models/language.model';
import { BaseHeader } from '../base-header';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [
    UpperCasePipe,
    RouterModule,
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './desktop-header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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