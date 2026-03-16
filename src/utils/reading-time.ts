export function getReadingTime(text: string): number {
  // Strip markdown syntax
  const clean = text
    .replace(/---[\s\S]*?---/, '') // frontmatter
    .replace(/!?\[.*?\]\(.*?\)/g, '') // links/images
    .replace(/[#*>`~_\-|]/g, '') // markdown chars
    .trim();

  // Chinese characters (~400 chars/min)
  const chinese = (clean.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  // English words (~200 words/min)
  const english = clean.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').split(/\s+/).filter(Boolean).length;

  const minutes = Math.ceil(chinese / 400 + english / 200);
  return Math.max(1, minutes);
}
