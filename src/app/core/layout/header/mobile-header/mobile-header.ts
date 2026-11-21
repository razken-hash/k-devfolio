import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BaseHeader } from '../base-header';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [
    ThemeToggle,
    UpperCasePipe,
    RouterModule,
    FontAwesomeModule,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './mobile-header.html',
})
export class MobileHeader extends BaseHeader {
  @Input() mobileMenuOpen: boolean = false;
  @Input() currentYear: number = new Date().getFullYear();

  @Output() menuToggled = new EventEmitter<void>();

  toggleMenu(): void {
    this.menuToggled.emit();
  }
}