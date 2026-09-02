export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function formatCategory(category: string): string {
  return category === 'langsung'
    ? 'Pelayanan Langsung'
    : 'Pelayanan Tidak Langsung';
}
