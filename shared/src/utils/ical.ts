const groupBy = <T>(arr: T[], fn: (item: T) => any) =>
  arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});

/* https://regex101.com/r/gvUVMt/14 */
const disciplineRegex = /(.*)\s\(([а-я]+(?:,\s[а-я]+)*)\)/s;

export { groupBy, disciplineRegex };
