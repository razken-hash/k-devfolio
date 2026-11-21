import { Injectable, computed, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Owns the light/dark theme:
 *   - initial value: localStorage → OS preference → light;
 *   - applies it as the `dark` class on <html> (read by src/styles/theme.css
 *     and Tailwind), plus `color-scheme` and the browser `theme-color`;
 *   - persists the user's choice in localStorage.
 *
 * The boot script in src/index.html applies the same logic before Angular
 * starts, so the page never flashes the wrong theme. Keep STORAGE_KEY in sync.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  static readonly STORAGE_KEY = 'kdevfolio-theme';

  private readonly root = document.documentElement;
  private readonly systemQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

  private readonly _theme = signal<Theme>(this.initialTheme());

  /** The active theme. */
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    this.apply(this._theme(), false);

    // Follow the OS setting until the user picks a theme explicitly.
    this.systemQuery?.addEventListener('change', (event) => {
      if (!this.storedTheme()) {
        this.set(event.matches ? 'dark' : 'light', false);
      }
    });
  }

  toggle(): void {
    this.set(this.isDark() ? 'light' : 'dark');
  }

  set(theme: Theme, persist = true): void {
    if (persist) {
      try {
        localStorage.setItem(ThemeService.STORAGE_KEY, theme);
      } catch {
        // Storage can be unavailable (private mode, blocked cookies): theme still applies.
      }
    }

    if (theme !== this._theme()) {
      this._theme.set(theme);
      this.apply(theme, true);
    }
  }

  /**
   * Resolved value of a color token from theme.css, as a hex string
   * (e.g. token('accent') → "#a3e635"). For libraries that need real
   * colors instead of CSS variables, such as Mermaid's theme variables.
   */
  token(name: string): string {
    const channels = getComputedStyle(this.root)
      .getPropertyValue(`--color-${name}`)
      .trim()
      .split(/\s+/)
      .map(Number);

    if (channels.length !== 3 || channels.some(Number.isNaN)) {
      return '#000000';
    }

    return '#' + channels.map((c) => c.toString(16).padStart(2, '0')).join('');
  }

  // ---------------------------------------------------------------------------

  private initialTheme(): Theme {
    return this.storedTheme() ?? (this.systemQuery?.matches ? 'dark' : 'light');
  }

  private storedTheme(): Theme | null {
    try {
      const value = localStorage.getItem(ThemeService.STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  private apply(theme: Theme, animate: boolean): void {
    if (animate) {
      // Cross-fade colors only during the switch, not on every hover.
      this.root.classList.add('theme-transition');
      window.setTimeout(() => this.root.classList.remove('theme-transition'), 350);
    }

    this.root.classList.toggle('dark', theme === 'dark');
    this.root.style.colorScheme = theme;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', this.token('surface'));
  }
}
