const useContentList = (path: string = 'blog') => {
  return useFetch(`/api/markdown`);
};

export default useContentList;
