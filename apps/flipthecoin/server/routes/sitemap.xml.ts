const BASE = 'https://flipthecoin.app';

const STATIC_PAGES = [
  { path: '/', esPart: '/es/', priority: '1.0', changefreq: 'weekly' },
  {
    path: '/play/',
    esPart: '/es/play/',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/blog/',
    esPart: '/es/blog/',
    priority: '0.8',
    changefreq: 'weekly',
  },
  {
    path: '/blog/series/',
    esPart: '/es/blog/series/',
    priority: '0.7',
    changefreq: 'weekly',
  },
  {
    path: '/glossary/',
    esPart: '/es/glossary/',
    priority: '0.7',
    changefreq: 'weekly',
  },
  {
    path: '/about-us/',
    esPart: '/es/about-us/',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/extension/',
    esPart: '/es/extension/',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/toss-engine/',
    esPart: '/es/toss-engine/',
    priority: '0.6',
    changefreq: 'monthly',
  },
  {
    path: '/privacy-policy/',
    esPart: '/es/privacy-policy/',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    path: '/terms/',
    esPart: '/es/terms/',
    priority: '0.3',
    changefreq: 'yearly',
  },
];

function urlEntry(
  enHref: string,
  esHref: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return `
  <url>
    <loc>${enHref}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esHref}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>
  </url>
  <url>
    <loc>${esHref}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${esHref}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}"/>
  </url>`;
}

export default defineEventHandler(async (event) => {
  const today = new Date().toISOString().split('T')[0]!;

  const posts = await queryCollection(event, 'blog')
    .where('published', '=', true)
    .all();

  // Group posts by base stem so we can pair EN ↔ ES versions
  const groups = new Map<
    string,
    Record<string, { slug: string; date: string }>
  >();
  for (const post of posts) {
    const stem = post.stem ?? '';
    const baseStem = stem.replace(/\.[a-z]{2}$/i, '');
    if (!groups.has(baseStem)) groups.set(baseStem, {});
    const locale = (post._locale as string) ?? 'en';
    const slug = (post.slug as string) ?? '';
    const date = post.date ? String(post.date).split('T')[0]! : today;
    groups.get(baseStem)![locale] = { slug, date };
  }

  const staticEntries = STATIC_PAGES.map(
    ({ path, esPart, priority, changefreq }) =>
      urlEntry(
        `${BASE}${path}`,
        `${BASE}${esPart}`,
        today,
        changefreq,
        priority,
      ),
  ).join('');

  const blogEntries = [...groups.values()]
    .map((locales) => {
      const en = locales['en'];
      const es = locales['es'];
      if (!en && !es) return '';
      const enHref = en ? `${BASE}/blog/${en.slug}/` : '';
      const esHref = es ? `${BASE}/es/blog/${es.slug}/` : '';
      const lastmod = en?.date ?? es?.date ?? today;
      if (!enHref || !esHref) {
        // Only one locale exists — emit without alternate hreflang
        const href = enHref || esHref; // already has trailing slash from above
        return `
  <url>
    <loc>${href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
      return urlEntry(enHref, esHref, lastmod, 'monthly', '0.7');
    })
    .join('');

  // Series listing pages (/blog/series/:slug/). Series share one slug across
  // locales, so pair them by slug. `date` (when set) anchors lastmod.
  const seriesRows = await queryCollection(event, 'series').all();
  const seriesBySlug = new Map<string, Record<string, { date: string }>>();
  for (const row of seriesRows) {
    const slug = (row.slug as string) ?? '';
    if (!slug) continue;
    if (!seriesBySlug.has(slug)) seriesBySlug.set(slug, {});
    const locale = (row._locale as string) ?? 'en';
    const date = row.date ? String(row.date).split('T')[0]! : today;
    seriesBySlug.get(slug)![locale] = { date };
  }

  const seriesEntries = [...seriesBySlug.entries()]
    .map(([slug, locales]) => {
      const en = locales['en'];
      const es = locales['es'];
      const enHref = `${BASE}/blog/series/${slug}/`;
      const esHref = `${BASE}/es/blog/series/${slug}/`;
      const lastmod = en?.date ?? es?.date ?? today;
      return urlEntry(enHref, esHref, lastmod, 'weekly', '0.7');
    })
    .join('');

  // Glossary term pages (/glossary/:slug/). Terms use per-locale slugs but share
  // one filename stem across locales, so pair en↔es by base stem (like blog).
  const glossaryRows = await queryCollection(event, 'glossary').all();
  const glossaryByStem = new Map<string, Record<string, { slug: string }>>();
  for (const row of glossaryRows) {
    const slug = (row.slug as string) ?? '';
    if (!slug) continue;
    const baseStem = String(row.stem ?? '').replace(/\.[a-z]{2}$/i, '');
    if (!glossaryByStem.has(baseStem)) glossaryByStem.set(baseStem, {});
    const locale = (row._locale as string) ?? 'en';
    glossaryByStem.get(baseStem)![locale] = { slug };
  }

  const glossaryEntries = [...glossaryByStem.values()]
    .map((locales) => {
      const en = locales['en'];
      const es = locales['es'];
      if (!en && !es) return '';
      const enHref = en ? `${BASE}/glossary/${en.slug}/` : '';
      const esHref = es ? `${BASE}/es/glossary/${es.slug}/` : '';
      if (!enHref || !esHref) {
        const href = enHref || esHref;
        return `
  <url>
    <loc>${href}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
      return urlEntry(enHref, esHref, today, 'monthly', '0.6');
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${staticEntries}
${blogEntries}
${seriesEntries}
${glossaryEntries}
</urlset>`;

  setHeader(event, 'Content-Type', 'application/xml');
  return xml;
});
