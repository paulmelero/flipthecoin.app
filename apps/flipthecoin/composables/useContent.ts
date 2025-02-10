export default function useContent(slug: string) {
  return useFetch(`/api/markdown/${slug}`);
}
