export interface GlossaryTerm {
  slug: string;
  title: string;
  description: string;
  link: string | null;
  aka: string[];
}

/**
 * Client-side access to the glossary index. Fetches the prerendered
 * `/api/glossary/<locale>` JSON once per locale, caches it in shared state, and
 * resolves terms by slug (or any `aka` alias). Powers the hover preview on
 * `:term[...]` references in blog posts.
 */
export function useGlossary() {
  const { $getLocale } = useI18n();

  // Per-locale cache, shared across every Term instance on the page so the
  // index is fetched at most once per locale.
  const cache = useState<Record<string, GlossaryTerm[]>>(
    'glossary-cache',
    () => ({}),
  );
  const inflight = useState<Record<string, Promise<GlossaryTerm[]> | null>>(
    'glossary-inflight',
    () => ({}),
  );

  async function load(locale?: string): Promise<GlossaryTerm[]> {
    const loc = locale ?? ($getLocale() as string) ?? 'en';
    if (cache.value[loc]) return cache.value[loc]!;
    if (inflight.value[loc]) return inflight.value[loc]!;

    // Force JSON parsing: the prerendered route ships as an extensionless
    // static asset, and the Cloudflare edge may serve it without an
    // `application/json` content-type — which would otherwise make ofetch
    // return a Blob instead of the parsed array.
    const promise = $fetch<GlossaryTerm[]>(`/api/glossary/${loc}`, {
      responseType: 'json',
    })
      .then((data) => {
        cache.value[loc] = data;
        return data;
      })
      .finally(() => {
        inflight.value[loc] = null;
      });

    inflight.value[loc] = promise;
    return promise;
  }

  /** Resolve a term by its slug, falling back to a case-insensitive `aka` match. */
  async function resolve(
    slugOrAlias: string,
    locale?: string,
  ): Promise<GlossaryTerm | null> {
    const terms = await load(locale);
    const needle = slugOrAlias.toLowerCase();
    return (
      terms.find((t) => t.slug === slugOrAlias) ??
      terms.find((t) => t.slug.toLowerCase() === needle) ??
      terms.find((t) => t.aka.some((a) => a.toLowerCase() === needle)) ??
      null
    );
  }

  return { load, resolve };
}
