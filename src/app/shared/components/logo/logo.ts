import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LogoSize = 'xs' | 'sm' | 'lg';

let nextId = 0;

/**
 * Brand logo: a laptop whose display shows a glowing "K" with a blinking
 * cursor, and the "Devfolio" wordmark underneath.
 * Hover effects trigger on the closest ancestor with the `group` class
 * (e.g. the wrapping link), as well as on the logo itself.
 *
 * The laptop body uses fixed space-gray colors (like real hardware), so it
 * looks the same in both themes; the display content uses the theme accent.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex flex-col items-center select-none' },
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  /** `xs` fits inline badges; `sm` fits the 80px header; `lg` is for the footer. */
  readonly size = input<LogoSize>('sm');

  /** Whether to show the "Devfolio" wordmark under the laptop. */
  readonly showWordmark = input(true);

  /** Unique SVG ids, so several logos on one page don't clash. */
  protected readonly ids = (() => {
    const n = nextId++;
    const id = (name: string) => `logo-${name}-${n}`;
    return {
      k: id('k'), lid: id('lid'), display: id('display'), deck: id('deck'),
      lip: id('lip'), glow: id('glow'), shadow: id('shadow'),
    };
  })();

  private static readonly SIZES: Record<LogoSize, { svg: string; word: string }> = {
    xs: { svg: 'h-[15px] w-[21px]', word: 'mt-0.5 text-[6px] tracking-[0.15em]' },
    sm: { svg: 'h-[38px] w-[54px]', word: 'mt-1 text-[9px] tracking-[0.2em]' },
    lg: { svg: 'h-[52px] w-[74px]', word: 'mt-1.5 text-xs tracking-[0.25em]' },
  };

  protected readonly sizes = computed(() => Logo.SIZES[this.size()]);

  protected url(id: string): string {
    return `url(#${id})`;
  }
}
