import { getCollection, type CollectionEntry } from "astro:content";
import { POSTS_PER_PAGE, postPath } from "./site";

export type Post = CollectionEntry<"posts">;

let cache: Post[] | null = null;
/** All published Dutch posts, newest first (sticky posts are not pinned on the original site). */
export async function allPosts(): Promise<Post[]> {
  if (!cache) cache = (await getCollection("posts")).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return cache;
}
export const urlOf = (p: Post) => postPath(p.data.date, p.data.wpSlug);

export interface Page<T> { items: T[]; current: number; total: number; url: (n: number) => string; prev?: string; next?: string }
/** Splits a list into pages and returns the Astro static paths for a `[...page]` rest param that produces /base/, /base/page/2/, ... */
export function paginated<T>(items: T[], base: string, pageSize = POSTS_PER_PAGE) {
  const total = Math.max(1, Math.ceil(items.length / pageSize));
  const url = (n: number) => (n <= 1 ? base : `${base}page/${n}/`);
  return Array.from({ length: total }, (_, i) => {
    const current = i + 1;
    const page: Page<T> = { items: items.slice(i * pageSize, (i + 1) * pageSize), current, total, url, prev: current > 1 ? url(current - 1) : undefined, next: current < total ? url(current + 1) : undefined };
    return { params: { page: current === 1 ? undefined : `page/${current}` }, props: { page } };
  });
}
/** WordPress paginate_links() numbering: end_size 1, mid_size 2, with dots. */
export function pageNumbers(current: number, total: number): (number | "dots")[] {
  const out: (number | "dots")[] = [];
  let dots = false;
  for (let n = 1; n <= total; n++) {
    if (n === 1 || n === total || Math.abs(n - current) <= 2 || (current <= 3 && n <= 3) || (current >= total - 2 && n >= total - 2)) { out.push(n); dots = false; }
    else if (!dots) { out.push("dots"); dots = true; }
  }
  return out;
}
