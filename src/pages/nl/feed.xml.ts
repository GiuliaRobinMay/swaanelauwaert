import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { allPosts, urlOf } from "../../lib/posts";
import { SITE_NAME, SITE_URL } from "../../lib/site";

export async function GET(_context: APIContext) {
  const posts = (await allPosts()).slice(0, 20);
  return rss({
    title: SITE_NAME,
    description: "The Journal – Swaane Lauwaert",
    site: SITE_URL,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.excerpt, link: urlOf(p), categories: p.data.categories })),
    customData: "<language>nl-BE</language>",
  });
}
