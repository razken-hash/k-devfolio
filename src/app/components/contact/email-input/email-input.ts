import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    TranslateModule
  ],
  templateUrl: './email-input.html',
})
export class EmailInput {
  faEnvelope = faEnvelope;

  @Input() email: string = '';
  @Output() emailChange = new EventEmitter<string>();

  suggestionSuffix = '';

  private index = 0;
  private readonly minChars = 2;
  private completionAccepted = false;

  private readonly tlds = [
    'com', 'org', 'net', 'fr', 'dz', 'tr', 'es', 'en', 'io'
  ];

  private readonly domains = [
    'gmail', 'outlook', 'hotmail', 'yahoo', 'icloud'
  ];

  // Gmail-style local part validation
  localPartRegex =
    /^(?=.{2,}$)[a-zA-Z0-9](?:(?![._+%-]{2})[a-zA-Z0-9._+%-])*[a-zA-Z0-9]$/;

  // =========================
  // INPUT CHANGE HANDLER
  // =========================
  onEmailChange(value: string): void {
    const input = (value || '').toLowerCase();
    this.email = input;
    this.emailChange.emit(this.email);

    if (this.completionAccepted) {
      this.completionAccepted = false;
    }

    if (input.length < this.minChars) {
      this.suggestionSuffix = '';
      return;
    }

    const [localPart = '', domainPart = ''] = input.split('@');

    // BEFORE '@' → suggest domain
    if (!input.includes('@')) {
      if (!this.localPartRegex.test(localPart)) {
        this.suggestionSuffix = '';
        return;
      }

      this.index = 0;
      this.suggestionSuffix = `@${this.domains[0]}.`;
      return;
    }

    // AFTER '@'
    const lastDotIndex = domainPart.lastIndexOf('.');
    const hasDot = lastDotIndex !== -1;

    let domainName = '';
    let tldPart = '';

    if (hasDot) {
      domainName = domainPart.slice(0, lastDotIndex);
      tldPart = domainPart.slice(lastDotIndex + 1);
    } else {
      domainName = domainPart;
    }

    // Suggest domain
    if (!hasDot) {
      const match = this.domains.find(d =>
        d.startsWith(domainName)
      );

      this.suggestionSuffix = match
        ? match.substring(domainName.length) + '.'
        : '';
      return;
    }

    // Suggest TLD when dot is typed
    if (domainPart.endsWith('.') && tldPart === '') {
      this.index = 0;
      this.suggestionSuffix = this.tlds[0];
      return;
    }

    // Suggest matching TLD
    const matchTld = this.tlds.find(t =>
      t.startsWith(tldPart)
    );

    this.suggestionSuffix = matchTld
      ? matchTld.substring(tldPart.length)
      : '';
  }

  // =========================
  // KEYBOARD HANDLER
  // =========================
  onKeyDown(event: KeyboardEvent): void {
    const acceptKeys = ['Tab', 'Enter', 'ArrowRight'];

    // Accept suggestion
    if (acceptKeys.includes(event.key) && this.suggestionSuffix) {
      event.preventDefault();

      this.email += this.suggestionSuffix;
      this.emailChange.emit(this.email);

      this.suggestionSuffix = '';
      this.index = 0;
      this.completionAccepted = true;

      setTimeout(() => this.onEmailChange(this.email));
      return;
    }

    // Cycle domains with ArrowDown (before '@')
    if (event.key === 'ArrowDown' && !this.email.includes('@')) {
      event.preventDefault();

      this.index = (this.index + 1) % this.domains.length;
      this.suggestionSuffix = `@${this.domains[this.index]}.`;
    }
  }
}