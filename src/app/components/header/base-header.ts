import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { NavigationLink } from '../../models/navigation-link.model';
import { Language } from '../../models/language.model';

@Directive()
export abstract class BaseHeader {
    @Input() navigationLinks: NavigationLink[] = [];
    @Input() availableLanguages: Language[] = [];
    @Input() currentLanguage: string = '';

    @Output() linkClicked = new EventEmitter<string>();
    @Output() languageChanged = new EventEmitter<string>();

    onLinkClick(url: string): void {
        this.linkClicked.emit(url);
    }

    onLanguageChange(code: string): void {
        this.languageChanged.emit(code);
    }
}