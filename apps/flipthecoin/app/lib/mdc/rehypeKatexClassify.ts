import { visit } from 'unist-util-visit';

export function rehypeKatexClassify() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName !== 'p') return;

      const meaningful = (node.children || []).filter((child: any) => {
        if (child.type === 'comment') return false;
        if (child.type === 'text' && !child.value.trim()) return false;
        return true;
      });

      if (
        meaningful.length === 1 &&
        meaningful[0].type === 'element' &&
        meaningful[0].tagName === 'span' &&
        (meaningful[0].properties?.className || []).includes('katex')
      ) {
        const classes: string[] = node.properties.className || [];
        node.properties.className = [...classes, 'math-block'];
      }
    });
  };
}

export default {
  instance: rehypeKatexClassify,
  options: {},
};
