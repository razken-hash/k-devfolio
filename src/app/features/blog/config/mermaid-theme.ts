import type { MermaidConfig } from 'mermaid';

/** Shorthand for a theme token from src/styles/theme.css, optionally with alpha. */
const t = (name: string, alpha?: number) =>
  alpha === undefined ? `rgb(var(--color-${name}))` : `rgb(var(--color-${name}) / ${alpha})`;

/**
 * Extra CSS injected INSIDE the generated <svg>. Mermaid scopes every rule
 * to `#mermaid-<id>`, so it can never leak into the rest of the page.
 *
 * Colors are CSS variables: the SVG is inlined in the page, so it inherits
 * the theme tokens and switches light/dark live, without re-rendering.
 *
 * `.is-root` / `.is-leaf` are classes added by MermaidStyleService.
 * `!important` is used on purpose: Mermaid's own selectors are id-scoped
 * and (for the "neo" look) attribute-scoped, so they are hard to outrank.
 *
 * The "leaf" rule must stay above the "root" rule: a node that is both
 * (single-node graph) should look like a root.
 */
const THEME_CSS = `
  /* ---------- nodes ---------- */
  .node rect, .node polygon, .node circle, .node ellipse {
    fill: ${t('accent', 0.08)} !important;
    stroke: ${t('accent', 0.45)} !important;
    stroke-width: 1.5px !important;
    filter: none !important;
    rx: 12px;
    ry: 12px;
  }
  .nodeLabel, .nodeLabel p, .node .label text {
    color: ${t('fg')} !important;
    fill: ${t('fg')} !important;
    line-height: 1.4;
  }

  /* leaf nodes: a cooler teal outline so the end of each branch reads at a glance */
  .node.is-leaf rect, .node.is-leaf polygon, .node.is-leaf circle, .node.is-leaf ellipse {
    fill: ${t('secondary', 0.07)} !important;
    stroke: ${t('secondary', 0.5)} !important;
  }

  /* root node: same treatment as the primary buttons (accent fill, on-accent text) */
  .node.is-root rect, .node.is-root polygon, .node.is-root circle, .node.is-root ellipse {
    fill: ${t('accent')} !important;
    stroke: ${t('accent')} !important;
  }
  .node.is-root .nodeLabel, .node.is-root .nodeLabel p, .node.is-root .label text {
    color: ${t('on-accent')} !important;
    fill: ${t('on-accent')} !important;
    font-weight: 700;
  }

  /* ---------- edges ---------- */
  .flowchart-link, .edgePaths .path {
    stroke: ${t('accent-strong')} !important;
    stroke-width: 1.5px !important;
  }
  .marker, .arrowheadPath {
    fill: ${t('accent-strong')} !important;
    stroke: ${t('accent-strong')} !important;
  }
  .edgeLabel, .edgeLabel p, .labelBkg {
    background-color: ${t('surface')} !important;
    color: ${t('fg-muted')} !important;
    border-radius: 6px;
  }
  .edgeLabel rect {
    fill: ${t('surface')} !important;
    opacity: 1 !important;
  }

  /* ---------- subgraphs ---------- */
  .cluster rect {
    fill: ${t('overlay', 0.04)} !important;
    stroke: ${t('overlay', 0.15)} !important;
    rx: 16px;
    ry: 16px;
  }
  .cluster-label span, .cluster-label text, .cluster .nodeLabel {
    color: ${t('accent')} !important;
    fill: ${t('accent')} !important;
  }

  /* ---------- other diagram types (sequence, class, state…) ---------- */
  text, .messageText, .loopText, .noteText, .labelText, .actor tspan {
    fill: ${t('fg-muted')};
  }
  .actor, .labelBox, .note, rect.note {
    fill: ${t('accent', 0.08)} !important;
    stroke: ${t('accent', 0.45)} !important;
  }
  .messageLine0, .messageLine1, .loopLine, .actor-line {
    stroke: ${t('accent-strong')} !important;
  }
  #arrowhead path, .arrowheadPath {
    fill: ${t('accent-strong')} !important;
    stroke: ${t('accent-strong')} !important;
  }
`;

/**
 * Builds the Mermaid config for the current theme.
 *
 * `themeVariables` must be real colors (Mermaid derives shades from them),
 * so they are resolved from the active theme tokens by the caller,
 * e.g. `createMermaidConfig((name) => themeService.token(name))`.
 * Most visible colors are then overridden live by THEME_CSS above.
 */
export function createMermaidConfig(color: (token: string) => string): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: 'strict',

    flowchart: {
      rankSpacing: 90, // vertical gap between rows (Mermaid default: 50)
      // nodeSpacing: 50, // horizontal gap between boxes on the same row (default: 50)
      // padding: 15,     // inner padding of each box; raise it to make boxes taller (default: 15)
    },

    // "base" is the only theme whose variables can be customised.
    theme: 'base',

    themeVariables: {
      fontFamily: 'inherit', // reuse the page font so measured and rendered text match
      fontSize: '15px',
      background: 'transparent',

      primaryColor: color('surface-alt'),
      primaryTextColor: color('fg'),
      primaryBorderColor: color('accent'),
      secondaryColor: color('surface'),
      secondaryTextColor: color('fg'),
      secondaryBorderColor: color('accent'),
      tertiaryColor: color('surface-deep'),
      tertiaryTextColor: color('fg'),
      tertiaryBorderColor: color('secondary'),

      lineColor: color('accent-strong'),
      textColor: color('fg-muted'),
      mainBkg: color('surface-alt'),
      nodeBorder: color('accent'),
      nodeTextColor: color('fg'),
      clusterBkg: color('surface-deep'),
      clusterBorder: color('secondary'),
      edgeLabelBackground: color('surface'),
      titleColor: color('fg'),
    },

    themeCSS: THEME_CSS,
  };
}
