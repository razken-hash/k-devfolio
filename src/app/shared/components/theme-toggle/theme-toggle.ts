import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../../core/services/theme.service';

/** Button that switches between the light and dark theme. */
@Component({
  selector: 'app-theme-toggle',
  imports: [FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
      [attr.title]="themeService.isDark() ? 'Light theme' : 'Dark theme'"
      [class]="sizeClass()"
      class="group relative flex items-center justify-center overflow-hidden rounded-lg
             bg-overlay/10 border border-overlay/20 text-accent
             hover:bg-overlay/20 hover:border-accent/50
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
             transition-all duration-300">
      <!-- Both icons are rendered; the inactive one rotates out of view -->
      <fa-icon
        [icon]="faSun"
        class="absolute transition-all duration-500"
        [class]="themeService.isDark() ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'" />
      <fa-icon
        [icon]="faMoon"
        class="absolute transition-all duration-500"
        [class]="themeService.isDark() ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'" />
    </button>
  `,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);

  /** Tailwind size classes of the button. */
  readonly sizeClass = input('h-10 w-10');

  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
}
