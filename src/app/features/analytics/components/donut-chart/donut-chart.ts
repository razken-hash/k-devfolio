import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

/** One slice of the donut. `slot` picks the categorical color (1–5); 0 = neutral "Other/Unknown". */
export interface DonutDatum {
  name: string;
  count: number;
  percentage: number;
  slot: number;
}

interface DonutSegment extends DonutDatum {
  dashArray: string;
  dashOffset: number;
}

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Surface-colored gap between adjacent slices (viewBox units, ~2px at 128px). */
const GAP = 1.6;

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './donut-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    /* Categorical palette (validated: light vs #ffffff card, dark vs #0e2117 card). */
    :host {
      display: block;
      --series-0: #9a9990;
      --series-1: #2a78d6;
      --series-2: #eb6834;
      --series-3: #1baf7a;
      --series-4: #eda100;
      --series-5: #e87ba4;
    }
    :host-context(.dark) {
      --series-0: #6b6b66;
      --series-1: #3987e5;
      --series-2: #d95926;
      --series-3: #199e70;
      --series-4: #c98500;
      --series-5: #d55181;
    }
    .segment { transition: opacity 150ms ease, stroke-width 150ms ease; }
    .dimmed { opacity: 0.35; }
  `,
})
export class DonutChartComponent {
  readonly data = input.required<DonutDatum[]>();
  /** Accessible name, e.g. "Visits by device". */
  readonly label = input.required<string>();
  /** Unit shown under the center figure. */
  readonly unit = input('visits');

  readonly radius = RADIUS;
  readonly circumference = CIRCUMFERENCE;

  readonly active = signal<string | null>(null);

  readonly total = computed(() =>
    this.data().reduce((sum, d) => sum + d.count, 0),
  );

  /** Only slices with visits are drawn; the legend still lists everything. */
  readonly segments = computed<DonutSegment[]>(() => {
    const total = this.total();
    const visible = this.data().filter((d) => d.count > 0);
    const gap = visible.length > 1 ? GAP : 0;
    let start = 0;

    return visible.map((d) => {
      const length = (d.count / total) * CIRCUMFERENCE;
      const drawn = Math.max(length - gap, 0.5);
      const segment: DonutSegment = {
        ...d,
        dashArray: `${drawn} ${CIRCUMFERENCE - drawn}`,
        dashOffset: -start,
      };
      start += length;
      return segment;
    });
  });

  readonly activeDatum = computed(() => {
    const name = this.active();
    return name ? this.data().find((d) => d.name === name) ?? null : null;
  });

  color(slot: number): string {
    return `var(--series-${slot})`;
  }
}
