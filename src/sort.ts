import { isString } from "./type";

export function toSortedBy<T extends Record<string, unknown>>(
  arr: T[],
  key: string,
): T[] {
  return arr
    .map((obj) => ({ ...obj }))
    .sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (isString(aValue) && isString(bValue)) {
        if (aValue.toLowerCase() < bValue.toLowerCase()) return -1;
        if (aValue.toLowerCase() > bValue.toLowerCase()) return 1;
      }

      return 0;
    });
}
