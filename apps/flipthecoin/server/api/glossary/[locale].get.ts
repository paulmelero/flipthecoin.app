// Prerendered JSON index of glossary terms for one locale. Fetched once,
// client-side, by useGlossary() to power the hover preview on `:term[...]`
// references in blog posts (see app/components/content/Term.vue). Listed in
// nuxt.config nitro.prerender.routes so it ships as a static asset.
export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale') === 'es' ? 'es' : 'en';

  const terms = await queryCollection(event, 'glossary')
    .where('_locale', '=', locale)
    .all();

  setHeader(event, 'Content-Type', 'application/json');

  return terms
    .map((t) => ({
      slug: t.slug as string,
      title: t.title as string,
      description: t.description as string,
      link: (t.link as string | undefined) ?? null,
      aka: (t.aka as string[] | undefined) ?? [],
    }))
    .sort((a, b) => a.title.localeCompare(b.title, locale));
});
