const groupBy = <T, Y extends string | number | symbol>(
  arr: T[],
  fn: (item: T) => Y,
) =>
  arr.reduce<Record<Y, T[]>>(
    (prev, curr) => {
      const groupKey = fn(curr);
      const group = prev[groupKey] || [];
      group.push(curr);
      return { ...prev, [groupKey]: group };
    },
    {} as Record<Y, T[]>,
  );

/* https://regex101.com/r/gvUVMt/14 */
const disciplineRegex = /(.*)\s\(([а-я]+(?:,\s[а-я]+)*)\)/s;

export { groupBy, disciplineRegex };
