export const findDatasetInParents = (elem: HTMLElement, data: string): boolean => {
  if (elem.dataset[data]) return true;
  if (elem.parentElement) return findDatasetInParents(elem.parentElement, data);
  return false;
};
