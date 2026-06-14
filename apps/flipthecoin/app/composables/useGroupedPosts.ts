import type { BlogCollectionItem, SeriesCollectionItem } from '@nuxt/content';

type Post = BlogCollectionItem;
type SeriesBySlug = Record<string, SeriesCollectionItem>;

export type GroupedItem =
  | {
      type: 'series';
      slug: string;
      meta: { title: string; description: string };
      members: Post[];
      anchor: string;
    }
  | { type: 'post'; post: Post; anchor: string };

// Frontmatter fields land on `.meta` in Nuxt Content v3, but some queries expose
// them top-level too — read both, mirroring the defensive pattern in BlogPost.vue.
const metaField = <T = unknown>(post: Post, key: string): T | undefined => {
  const m = (post as unknown as { meta?: Record<string, unknown> }).meta;
  const top = post as unknown as Record<string, unknown>;
  return (m?.[key] ?? top[key]) as T | undefined;
};

const dateOf = (post: Post): string =>
  String(metaField<string>(post, 'date') ?? '');

/**
 * Groups blog posts into series blocks + standalone posts.
 * - Posts with a `series` are grouped, sorted by `seriesOrder` ASC (date ASC tiebreak).
 * - Each block is anchored at the series' own `date`, falling back to its
 *   most-recent member's date when the series has no `date`.
 * - Standalone posts are anchored at their own date.
 * - Blocks and standalone posts are interleaved by anchor DESC.
 *
 * `posts` is assumed already _locale-filtered and published-filtered.
 */
export function useGroupedPosts(
  posts: Post[] | undefined | null,
  seriesBySlug: SeriesBySlug,
): GroupedItem[] {
  const bySeries = new Map<string, Post[]>();
  const standalone: Post[] = [];

  for (const post of posts ?? []) {
    const series = metaField<string>(post, 'series');
    if (series) {
      const arr = bySeries.get(series) ?? [];
      arr.push(post);
      bySeries.set(series, arr);
    } else {
      standalone.push(post);
    }
  }

  const items: GroupedItem[] = [];

  for (const [slug, members] of bySeries) {
    members.sort((a, b) => {
      const oa = metaField<number>(a, 'seriesOrder') ?? Number.MAX_SAFE_INTEGER;
      const ob = metaField<number>(b, 'seriesOrder') ?? Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;
      return dateOf(a).localeCompare(dateOf(b));
    });
    const meta = seriesBySlug[slug];
    // Prefer the series' explicit `date` (pins its position in the list); else
    // anchor at the newest member. ISO date strings compare lexically, so
    // reduce-to-max gives the newest.
    const newest = members.reduce((max, m) => {
      const d = dateOf(m);
      return d > max ? d : max;
    }, '');
    const anchor = meta?.date ? String(meta.date) : newest;
    items.push({
      type: 'series',
      slug,
      meta: {
        title: meta?.title ?? slug,
        description: meta?.description ?? '',
      },
      members,
      anchor,
    });
  }

  for (const post of standalone) {
    items.push({ type: 'post', post, anchor: dateOf(post) });
  }

  items.sort((a, b) => b.anchor.localeCompare(a.anchor));
  return items;
}
