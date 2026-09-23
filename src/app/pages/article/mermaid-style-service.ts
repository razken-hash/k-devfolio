import { Injectable } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

interface FlowEdge {
  path: SVGPathElement;
  dataId: string; // e.g. "L_A_B_0"
  source: string; // node id, e.g. "A"
  target: string;
}

interface FlowGraph {
  nodes: Map<string, SVGGElement>;
  edges: FlowEdge[];
}

export interface MermaidEnhanceOptions {
  /** Center the single root node horizontally over the diagram (flowcharts, top-down only). */
  centerRoot?: boolean;

  /** Give leaf nodes their own (teal) color. Set to false to style them like regular nodes. */
  colorLeaves?: boolean;
}

/**
 * Takes the SVG markup returned by `mermaid.render()` and returns improved markup.
 *
 * Colors are handled by MERMAID_CONFIG (themeVariables + themeCSS). This service
 * only does what CSS cannot:
 *   1. tags root / leaf nodes so themeCSS can style them;
 *   2. re-centers the root node and re-routes its outgoing edges;
 *   3. stops wide diagrams from being shrunk into unreadable text.
 *
 * Everything is attribute-based (no getBBox / getTotalLength), so it works on a
 * detached DOM and never needs the diagram to be on screen.
 */
@Injectable({ providedIn: 'root' })
export class MermaidStyleService {
  private readonly CORNER_RADIUS = 8;

  /** Below this scale (rendered width / natural width) the SVG scrolls instead of shrinking. */
  private readonly MIN_READABLE_SCALE = 0.75;

  enhance(svgMarkup: string, options: MermaidEnhanceOptions = {}): string {
    const { centerRoot = true, colorLeaves = true } = options;

    // The HTML parser is more forgiving than DOMParser('image/svg+xml')
    const host = document.createElement('div');
    host.innerHTML = svgMarkup;

    const svg = host.querySelector('svg');
    if (!svg) {
      return svgMarkup;
    }

    try {
      const graph = this.readFlowchart(svg);

      if (graph) {
        this.tagRootsAndLeaves(graph, colorLeaves);

        if (centerRoot) {
          this.centerSingleRoot(svg, graph);
        }
      }

      this.keepReadable(svg);
    } catch (error) {
      // Styling is cosmetic: never break the article because of it
      console.warn('Mermaid post-processing skipped:', error);
      return svgMarkup;
    }

    return host.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Graph extraction (flowcharts only; other diagram types simply return null)
  // ---------------------------------------------------------------------------

  private readFlowchart(svg: SVGSVGElement): FlowGraph | null {
    const nodes = new Map<string, SVGGElement>();

    // Node <g> ids look like "mermaid-<uuid>-flowchart-A-0"
    svg.querySelectorAll<SVGGElement>('g.node[id*="-flowchart-"]').forEach((el) => {
      const match = el.id.match(/-flowchart-(.+)-\d+$/);
      if (match) {
        nodes.set(match[1], el);
      }
    });

    if (nodes.size === 0) {
      return null;
    }

    // Edge data-ids look like "L_A_B_0" = L_<source>_<target>_<counter>.
    // Node ids may contain underscores, so resolve by testing known node ids.
    const edges: FlowEdge[] = [];

    svg.querySelectorAll<SVGPathElement>('path[data-edge="true"][data-id]').forEach((path) => {
      const dataId = path.getAttribute('data-id')!;
      const match = dataId.match(/^L_(.+)_\d+$/);
      if (!match) {
        return;
      }

      for (const source of nodes.keys()) {
        if (!match[1].startsWith(source + '_')) {
          continue;
        }
        const target = match[1].slice(source.length + 1);
        if (nodes.has(target)) {
          edges.push({ path, dataId, source, target });
          break;
        }
      }
    });

    return { nodes, edges };
  }

  private rootIds(graph: FlowGraph): string[] {
    const hasIncoming = new Set(graph.edges.map((e) => e.target));
    const hasOutgoing = new Set(graph.edges.map((e) => e.source));

    return [...graph.nodes.keys()].filter((id) => !hasIncoming.has(id) && hasOutgoing.has(id));
  }

  private tagRootsAndLeaves(graph: FlowGraph, colorLeaves: boolean): void {
    const hasIncoming = new Set(graph.edges.map((e) => e.target));
    const hasOutgoing = new Set(graph.edges.map((e) => e.source));

    graph.nodes.forEach((el, id) => {
      if (!hasIncoming.has(id) && hasOutgoing.has(id)) {
        el.classList.add('is-root');
      } else if (colorLeaves && !hasOutgoing.has(id) && hasIncoming.has(id)) {
        el.classList.add('is-leaf');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Centering the root node
  // ---------------------------------------------------------------------------

  private centerSingleRoot(svg: SVGSVGElement, graph: FlowGraph): void {
    const roots = this.rootIds(graph);
    if (roots.length !== 1) {
      return; // several entry points: leave Mermaid's layout alone
    }

    const rootId = roots[0];
    const rootEl = graph.nodes.get(rootId)!;
    const position = this.readTranslate(rootEl);
    const viewBox = this.readViewBox(svg);

    if (!position || !viewBox) {
      return;
    }

    // Another node on the same row (e.g. an unconnected node) would collide
    for (const [id, el] of graph.nodes) {
      const other = this.readTranslate(el);
      if (id !== rootId && other && Math.abs(other.y - position.y) < 1) {
        return;
      }
    }

    // Only handle orthogonal, top-down edges (Mermaid's default "rounded" routing).
    // Curved ("basis") or left-to-right diagrams are left as they are.
    const rootEdges = graph.edges.filter((e) => e.source === rootId);
    const routes = rootEdges.map((e) => this.readPoints(e.path));

    const isTopDown = routes.every(
      (pts) => pts !== null && pts.length >= 2 && pts[0].x === pts[1].x && this.isOrthogonal(pts)
    );
    if (!isTopDown) {
      return;
    }

    const dx = viewBox.x + viewBox.width / 2 - position.x;
    if (Math.abs(dx) < 1) {
      return;
    }

    this.setTranslate(rootEl, position.x + dx, position.y);

    rootEdges.forEach((edge, i) => this.rerouteEdge(svg, edge, routes[i]!, dx));
  }

  private rerouteEdge(svg: SVGSVGElement, edge: FlowEdge, points: Point[], dx: number): void {
    // Shift the leading vertical segment (the part that leaves the root box).
    // The last point (the target) never moves.
    const startX = points[0].x;
    const moved = points.map((p) => ({ ...p }));

    for (let i = 0; i < moved.length - 1 && moved[i].x === startX; i++) {
      moved[i].x += dx;
    }

    // A straight root -> child edge becomes an elbow once the root has moved
    const route = this.orthogonalize(moved);

    edge.path.setAttribute('d', this.roundedPath(route));
    edge.path.setAttribute('data-points', btoa(JSON.stringify(route)));

    // Mermaid's inline dash pattern was computed for the old path length
    edge.path.style.removeProperty('stroke-dasharray');
    edge.path.style.removeProperty('stroke-dashoffset');

    this.moveEdgeLabel(svg, edge.dataId, route);
  }

  /** Puts the edge label back on the middle of the new route (if the edge has a label). */
  private moveEdgeLabel(svg: SVGSVGElement, dataId: string, route: Point[]): void {
    const label = svg.querySelector(`.edgeLabels [data-id="${CSS.escape(dataId)}"]`);
    const holder = label?.closest('g.edgeLabel');

    if (!holder || !this.readTranslate(holder as SVGGElement)) {
      return;
    }

    const middle = this.polylineMiddle(route);
    this.setTranslate(holder as SVGGElement, middle.x, middle.y);
  }

  // ---------------------------------------------------------------------------
  // Readability on narrow screens
  // ---------------------------------------------------------------------------

  private keepReadable(svg: SVGSVGElement): void {
    const viewBox = this.readViewBox(svg);
    if (!viewBox) {
      return;
    }

    // The wrapper (.mermaid-container) has overflow-x: auto, so wide diagrams scroll
    svg.style.minWidth = `${Math.round(viewBox.width * this.MIN_READABLE_SCALE)}px`;
  }

  // ---------------------------------------------------------------------------
  // Small geometry helpers
  // ---------------------------------------------------------------------------

  private readViewBox(svg: SVGSVGElement): { x: number; y: number; width: number; height: number } | null {
    const parts = svg.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
    if (!parts || parts.length !== 4 || parts.some(Number.isNaN)) {
      return null;
    }
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
  }

  private readTranslate(el: SVGGElement): Point | null {
    const match = el
      .getAttribute('transform')
      ?.match(/translate\(\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?\s*\)/);

    return match ? { x: parseFloat(match[1]), y: match[2] ? parseFloat(match[2]) : 0 } : null;
  }

  private setTranslate(el: SVGGElement, x: number, y: number): void {
    el.setAttribute('transform', `translate(${x}, ${y})`);
  }

  private readPoints(path: SVGPathElement): Point[] | null {
    const raw = path.getAttribute('data-points');
    if (!raw) {
      return null;
    }
    try {
      const points = JSON.parse(atob(raw));
      return Array.isArray(points) ? points : null;
    } catch {
      return null;
    }
  }

  private isOrthogonal(points: Point[]): boolean {
    return points.every((p, i) => i === 0 || p.x === points[i - 1].x || p.y === points[i - 1].y);
  }

  private orthogonalize(points: Point[]): Point[] {
    const result: Point[] = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const a = result[result.length - 1];
      const b = points[i];

      if (a.x !== b.x && a.y !== b.y) {
        const midY = (a.y + b.y) / 2;
        result.push({ x: a.x, y: midY }, { x: b.x, y: midY });
      }
      result.push(b);
    }
    return result;
  }

  /** Polyline with rounded corners, similar to Mermaid's own "rounded" curve. */
  private roundedPath(points: Point[]): string {
    let d = `M${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const next = points[i + 1];

      const lenIn = Math.hypot(cur.x - prev.x, cur.y - prev.y);
      const lenOut = Math.hypot(next.x - cur.x, next.y - cur.y);
      const radius = Math.min(this.CORNER_RADIUS, lenIn / 2, lenOut / 2);

      if (radius < 0.5) {
        d += `L${cur.x},${cur.y}`;
        continue;
      }

      const startX = cur.x - ((cur.x - prev.x) / lenIn) * radius;
      const startY = cur.y - ((cur.y - prev.y) / lenIn) * radius;
      const endX = cur.x + ((next.x - cur.x) / lenOut) * radius;
      const endY = cur.y + ((next.y - cur.y) / lenOut) * radius;

      d += `L${startX},${startY}Q${cur.x},${cur.y} ${endX},${endY}`;
    }

    const last = points[points.length - 1];
    return `${d}L${last.x},${last.y}`;
  }

  private polylineMiddle(points: Point[]): Point {
    const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
    let remaining = lengths.reduce((sum, l) => sum + l, 0) / 2;

    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i] || i === lengths.length - 1) {
        const t = lengths[i] === 0 ? 0 : remaining / lengths[i];
        return {
          x: points[i].x + (points[i + 1].x - points[i].x) * t,
          y: points[i].y + (points[i + 1].y - points[i].y) * t,
        };
      }
      remaining -= lengths[i];
    }
    return points[0];
  }
}
