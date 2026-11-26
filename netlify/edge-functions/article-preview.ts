/**
 * Netlify Edge Function — rich link previews for blog articles.
 *
 * Link-preview crawlers (Facebook, LinkedIn, WhatsApp, X, Slack, Discord…)
 * do not run JavaScript, so the meta tags set by the Angular article page are
 * invisible to them. For those crawlers only, this function fetches the
 * article from the API and rewrites the static meta tags of index.html with
 * the article's title, description and cover image.
 *
 * Regular visitors are passed through untouched (no extra latency).
 *
 * Handles:  /blog/:slug  and  /:lang/blog/:slug  (lang = en | fr | es | tr)
 */

import type { Config, Context } from 'https://edge.netlify.com';

const API_URL = 'https://kdevfolio-api.onrender.com/api/v1/blog/articles';
const SITE_NAME = 'KDevfolio';
const AUTHOR = 'Abderrazak Kenniche';

/** The API can be slow (cold starts): give up and serve the default card after this. */
const API_TIMEOUT_MS = 8000;
/** Best-effort in-memory cache per edge instance. */
const CACHE_TTL_MS = 60 * 60 * 1000;
/** Max length of the description shown in the preview. */
const DESCRIPTION_MAX = 200;

const SUPPORTED_LANGUAGES = ['EN', 'FR', 'ES', 'TR'] as const;
const OG_LOCALES: Record<string, string> = {
  EN: 'en_US',
  FR: 'fr_FR',
  ES: 'es_ES',
  TR: 'tr_TR',
};

const CRAWLER_UA =
  /facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|linkedinbot|twitterbot|whatsapp|slackbot|slack-imgproxy|discordbot|telegrambot|skypeuripreview|pinterest|redditbot|applebot|googlebot|bingbot|duckduckbot|yandex|embedly|quora link preview|outbrain|vkshare|w3c_validator|mastodon|bluesky|iframely|nuzzel|xing-contenttabreceiver|google-inspectiontool/i;

interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  authorName?: string;
  categories?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ImageSize {
  width: number;
  height: number;
}

interface CachedArticle {
  article: ArticleMeta;
  imageSize: ImageSize | null;
}

/** Timeout for reading the cover image header (to get its dimensions). */
const IMAGE_TIMEOUT_MS = 3000;

const cache = new Map<string, { expires: number; value: CachedArticle }>();

export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get('user-agent') ?? '';

  if (!CRAWLER_UA.test(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/(?:([a-zA-Z]{2})\/)?blog\/([^/]+)\/?$/);

  if (!match) {
    return context.next();
  }

  const language = normalizeLanguage(match[1]);
  const slug = decodeURIComponent(match[2]);

  // Crawlers (e.g. Facebook) send a Range header. Request the full page
  // instead: the HTML is rewritten, so a partial (206) response and its
  // Content-Range would no longer match the body.
  const fullPageRequest = new Request(request);
  fullPageRequest.headers.delete('range');

  const [response, found] = await Promise.all([
    context.next(fullPageRequest),
    fetchArticle(slug, language),
  ]);

  const contentType = response.headers.get('content-type') ?? '';
  if (!found || !contentType.includes('text/html')) {
    return response;
  }

  const { article, imageSize } = found;

  const html = await response.text();
  const headers = new Headers(response.headers);
  // The body changes: drop headers that describe the original bytes.
  for (const name of ['content-length', 'content-range', 'accept-ranges', 'etag']) {
    headers.delete(name);
  }

  return new Response(injectMeta(html, article, imageSize, url, language), {
    status: response.status === 206 ? 200 : response.status,
    headers,
  });
};

export const config: Config = {
  path: ['/blog/*', '/*/blog/*'],
  // Never let a failure here break the page.
  onError: 'bypass',
};

// ---------------------------------------------------------------------------

function normalizeLanguage(code: string | undefined): string {
  const upper = (code ?? 'en').toUpperCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(upper) ? upper : 'EN';
}

async function fetchArticle(slug: string, language: string): Promise<CachedArticle | null> {
  const key = `${language}:${slug}`;
  const hit = cache.get(key);

  if (hit && hit.expires > Date.now()) {
    return hit.value;
  }

  try {
    const res = await fetch(
      `${API_URL}/slug/${encodeURIComponent(slug)}?language=${language}`,
      {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return null;
    }

    const article = (await res.json()) as ArticleMeta;
    const imageSize = article.imageUrl ? await fetchImageSize(article.imageUrl) : null;
    const value: CachedArticle = { article, imageSize };

    cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
    return value;
  } catch {
    return null;
  }
}

/**
 * Read the image's dimensions from its first bytes (HTTP Range request).
 * Facebook renders the image on the very first share only when
 * og:image:width / og:image:height are provided.
 */
async function fetchImageSize(src: string): Promise<ImageSize | null> {
  try {
    const res = await fetch(src, {
      headers: { range: 'bytes=0-65535' },
      signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
    });

    if (!res.ok) {
      return null;
    }

    const bytes = new Uint8Array(await res.arrayBuffer());
    return parseImageSize(bytes);
  } catch {
    return null;
  }
}

function parseImageSize(b: Uint8Array): ImageSize | null {
  const ascii = (start: number, length: number) =>
    String.fromCharCode(...b.subarray(start, start + length));
  const u16le = (i: number) => b[i] | (b[i + 1] << 8);
  const u24le = (i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
  const u16be = (i: number) => (b[i] << 8) | b[i + 1];
  const u32be = (i: number) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];

  // PNG: IHDR chunk
  if (b.length >= 24 && b[0] === 0x89 && ascii(1, 3) === 'PNG') {
    return { width: u32be(16), height: u32be(20) };
  }

  // WebP: VP8 (lossy), VP8L (lossless), VP8X (extended)
  if (b.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const chunk = ascii(12, 4);
    if (chunk === 'VP8 ') {
      return { width: u16le(26) & 0x3fff, height: u16le(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') {
      return { width: u24le(24) + 1, height: u24le(27) + 1 };
    }
  }

  // JPEG: scan markers for a Start-Of-Frame segment
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isSof) {
        return { width: u16be(i + 7), height: u16be(i + 5) };
      }
      i += 2 + u16be(i + 2);
    }
  }

  return null;
}

function injectMeta(
  html: string,
  article: ArticleMeta,
  imageSize: ImageSize | null,
  url: URL,
  language: string,
): string {
  const pageUrl = `${url.origin}${url.pathname}`;
  const title = `${article.title} | ${SITE_NAME}`;
  const description = excerpt(article.description, DESCRIPTION_MAX);
  const image = article.imageUrl ? new URL(article.imageUrl, url.origin).href : '';
  const imageAlt = article.title;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${escapeAttr(pageUrl)}">`,
  );

  const tags: Array<[attr: 'name' | 'property', key: string, value: string]> = [
    ['name', 'description', description],
    ['name', 'author', article.authorName || AUTHOR],

    ['property', 'og:type', 'article'],
    ['property', 'og:url', pageUrl],
    ['property', 'og:title', article.title],
    ['property', 'og:description', description],
    ['property', 'og:locale', OG_LOCALES[language] ?? 'en_US'],

    ['name', 'twitter:title', article.title],
    ['name', 'twitter:description', description],
  ];

  if (image) {
    tags.push(
      ['property', 'og:image', image],
      ['property', 'og:image:secure_url', image],
      ['property', 'og:image:type', imageMimeType(image)],
      ['property', 'og:image:alt', imageAlt],
      ['name', 'twitter:image', image],
      ['name', 'twitter:image:alt', imageAlt],
    );
  }

  if (image && imageSize) {
    tags.push(
      ['property', 'og:image:width', String(imageSize.width)],
      ['property', 'og:image:height', String(imageSize.height)],
    );
  }

  for (const [attr, key, value] of tags) {
    html = setMeta(html, attr, key, value);
  }

  // The default card's dimensions must not be kept for an image of unknown size.
  if (!image || !imageSize) {
    html = removeMeta(html, 'property', 'og:image:width');
    html = removeMeta(html, 'property', 'og:image:height');
  }

  // Article-specific Open Graph tags.
  const extra: string[] = [];
  if (article.createdAt) extra.push(metaTag('property', 'article:published_time', article.createdAt));
  if (article.updatedAt) extra.push(metaTag('property', 'article:modified_time', article.updatedAt));
  extra.push(metaTag('property', 'article:author', article.authorName || AUTHOR));
  for (const category of article.categories ?? []) {
    extra.push(metaTag('property', 'article:tag', category));
  }

  return html.replace('</head>', `  ${extra.join('\n  ')}\n</head>`);
}

/** Replace the content of an existing meta tag, or append it to <head>. */
function setMeta(html: string, attr: string, key: string, value: string): string {
  const pattern = new RegExp(`<meta ${attr}="${escapeRegExp(key)}" content="[^"]*">`);
  const tag = metaTag(attr, key, value);

  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace('</head>', `  ${tag}\n</head>`);
}

function removeMeta(html: string, attr: string, key: string): string {
  return html.replace(new RegExp(`\\s*<meta ${attr}="${escapeRegExp(key)}" content="[^"]*">`), '');
}

function metaTag(attr: string, key: string, value: string): string {
  return `<meta ${attr}="${key}" content="${escapeAttr(value)}">`;
}

/** Trim to `max` characters on a word boundary, adding an ellipsis. */
function excerpt(text: string, max: number): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:!?-]+$/, '')}…`;
}

function imageMimeType(src: string): string {
  const ext = new URL(src).pathname.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    case 'avif': return 'image/avif';
    default: return 'image/jpeg';
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
