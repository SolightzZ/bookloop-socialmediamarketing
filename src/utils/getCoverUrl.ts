export function getCoverUrl(title: string): string {
  // Use Unsplash Source to fetch a random image related to the title.
  // Size 300x400 matches typical book cover dimensions.
  const baseUrl = 'https://source.unsplash.com/featured/300x400';
  const query = encodeURIComponent(title);
  return `${baseUrl}?${query}`;
}
