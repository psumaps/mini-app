export default function findAllLevels(features: any[]): string[] {
  return [...new Set(features.filter(f => f.properties.class !== 'level').map(s=>s.properties.level).sort())];
}
