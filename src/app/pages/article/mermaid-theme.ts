import type { MermaidConfig } from 'mermaid';

/**
 * Colors mirror the Tailwind tokens already used across the blog page
 * (emerald/teal gradient background, lime-400 accent, gray-300 body text).
 */
const C = {
  lime400: '#a3e635',
  lime500: '#84cc16',
  teal400: '#2dd4bf',
  teal900: '#134e4a',
  emerald900: '#064e3b',
  emerald950: '#022c22',
  gray100: '#f3f4f6',
  gray300: '#d1d5db',
};

/**
 * Extra CSS injected INSIDE the generated <svg>. Mermaid scopes every rule
 * to `#mermaid-<id>`, so it can never leak into the rest of the page.
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
    fill: rgba(163, 230, 53, 0.08) !important;
    stroke: rgba(163, 230, 53, 0.45) !important;
    stroke-width: 1.5px !important;
    filter: none !important;
    rx: 12px;
    ry: 12px;
  }
  .nodeLabel, .nodeLabel p, .node .label text {
    color: ${C.gray100} !important;
    fill: ${C.gray100} !important;
    line-height: 1.4;
  }

  /* leaf nodes: a cooler teal outline so the end of each branch reads at a glance */
  .node.is-leaf rect, .node.is-leaf polygon, .node.is-leaf circle, .node.is-leaf ellipse {
    fill: rgba(45, 212, 191, 0.07) !important;
    stroke: rgba(45, 212, 191, 0.5) !important;
  }

  /* root node: same treatment as the primary buttons (lime fill, emerald text) */
  .node.is-root rect, .node.is-root polygon, .node.is-root circle, .node.is-root ellipse {
    fill: ${C.lime400} !important;
    stroke: ${C.lime400} !important;
  }
  .node.is-root .nodeLabel, .node.is-root .nodeLabel p, .node.is-root .label text {
    color: ${C.emerald950} !important;
    fill: ${C.emerald950} !important;
    font-weight: 700;
  }

  /* ---------- edges ---------- */
  .flowchart-link, .edgePaths .path {
    stroke: ${C.lime500} !important;
    stroke-width: 1.5px !important;
  }
  .marker, .arrowheadPath {
    fill: ${C.lime500} !important;
    stroke: ${C.lime500} !important;
  }
  .edgeLabel, .edgeLabel p, .labelBkg {
    background-color: ${C.emerald900} !important;
    color: ${C.gray300} !important;
    border-radius: 6px;
  }
  .edgeLabel rect {
    fill: ${C.emerald900} !important;
    opacity: 1 !important;
  }

  /* ---------- subgraphs ---------- */
  .cluster rect {
    fill: rgba(255, 255, 255, 0.04) !important;
    stroke: rgba(255, 255, 255, 0.15) !important;
    rx: 16px;
    ry: 16px;
  }
  .cluster-label span, .cluster-label text, .cluster .nodeLabel {
    color: ${C.lime400} !important;
    fill: ${C.lime400} !important;
  }
`;

export const MERMAID_CONFIG: MermaidConfig = {
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

    primaryColor: C.teal900,
    primaryTextColor: C.gray100,
    primaryBorderColor: C.lime400,
    secondaryColor: C.emerald900,
    secondaryTextColor: C.gray100,
    secondaryBorderColor: C.lime400,
    tertiaryColor: C.emerald950,
    tertiaryTextColor: C.gray100,
    tertiaryBorderColor: C.teal400,

    lineColor: C.lime500,
    textColor: C.gray300,
    mainBkg: C.teal900,
    nodeBorder: C.lime400,
    nodeTextColor: C.gray100,
    clusterBkg: C.emerald950,
    clusterBorder: C.teal400,
    edgeLabelBackground: C.emerald900,
    titleColor: C.gray100,
  },

  themeCSS: THEME_CSS,
};
