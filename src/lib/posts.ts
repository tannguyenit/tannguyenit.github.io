import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const listed = (posts: Post[]) => posts.filter((p) => !p.data.hidden);

const labs = import.meta.glob('../labs/**/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function labHtml(lab?: string): string | undefined {
  if (!lab) return undefined;
  const html = labs[`../labs/${lab}.html`];
  if (!html) throw new Error(`Lab not found: ${lab}`);
  return html;
}

const labProse = (html = '') =>
  (html.match(/'(?:[^'\\\n]|\\.){30,}'|`[^`]{30,}`/g) ?? []).join(' ').replace(/<[^>]+>/g, ' ');

export const postMinutes = (post: Post) => readingMinutes(post.body + ' ' + labProse(labHtml(post.data.lab)));

export function readingMinutes(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const tagSlug = (t: string) => t.toLowerCase().replace(/\s+/g, '-');

export function inSeries(posts: Post[], id: string): Post[] {
  return posts.filter((p) => p.data.series === id).sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}
