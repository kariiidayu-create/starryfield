import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: URL }) {
  const games = await getCollection('games');
  const explorations = await getCollection('explorations');
  const crafts = await getCollection('crafts');
  const drawings = await getCollection('drawings');
  const cooking = await getCollection('cooking');

  const all = [
    ...games.map(p => ({ ...p, _col: 'games' })),
    ...explorations.map(p => ({ ...p, _col: 'explorations' })),
    ...crafts.map(p => ({ ...p, _col: 'crafts' })),
    ...drawings.map(p => ({ ...p, _col: 'drawings' })),
    ...cooking.map(p => ({ ...p, _col: 'cooking' })),
  ];

  return rss({
    title: 'STARRYFIELD',
    description: '星原 — 繁星栖息之所',
    site: context.site,
    items: all.map(post => ({
      title: post.data.title,
      pubDate: post.data.date ? new Date(post.data.date) : new Date(),
      link: `/${post._col}/${post.id}/`,
    })),
  });
}
