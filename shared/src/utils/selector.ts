const nodes = (selector: string) => [...document.querySelectorAll(selector)];
const node = (selector: string) => nodes(selector)[0];

export { nodes, node };
