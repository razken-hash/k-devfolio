import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BaseHeader } from '../base-header';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    TranslateModule
  ],
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