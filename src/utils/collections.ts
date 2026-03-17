import { getCollection } from 'astro:content';

export async function getSortedGames(limit?: number) {
  const all = await getCollection('games');
  const sorted = all.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getSortedExplorations(limit?: number) {
  const all = await getCollection('explorations');
  const sorted = all.sort((a, b) => b.data.date.localeCompare(a.data.date));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getSortedCrafts(limit?: number) {
  const all = await getCollection('crafts');
  const sorted = all.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getSortedDrawings(limit?: number) {
  const all = await getCollection('drawings');
  const sorted = all.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getSortedCooking(limit?: number) {
  const all = await getCollection('cooking');
  const sorted = all.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getAllCounts() {
  const [games, explorations, crafts, drawings, cooking] = await Promise.all([
    getCollection('games'),
    getCollection('explorations'),
    getCollection('crafts'),
    getCollection('drawings'),
    getCollection('cooking'),
  ]);
  return { games: games.length, explorations: explorations.length, crafts: crafts.length, drawings: drawings.length, cooking: cooking.length };
}
