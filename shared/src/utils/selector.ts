const nodes = (selector: string): Element[] => [
  ...document.querySelectorAll(selector),
];
const node = (selector: string): Element | null => nodes(selector)[0] ?? null;

export { nodes, node };
