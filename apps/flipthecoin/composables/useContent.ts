export const useContent = (slug: string) => {
  return useFetch(`/api/markdown/${slug}`);
};
