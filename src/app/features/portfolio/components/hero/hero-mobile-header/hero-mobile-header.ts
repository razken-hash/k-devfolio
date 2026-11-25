import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Logo } from '../../../../../shared/components/logo/logo';

@Component({
  selector: 'app-hero-mobile-header',
  imports: [UpperCasePipe, TranslateModule, Logo],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './hero-mobile-header.html',
})
export class HeroMobileHeader {}