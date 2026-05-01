import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-mobile-header',
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero-mobile-header.html',
})
export class HeroMobileHeader {}