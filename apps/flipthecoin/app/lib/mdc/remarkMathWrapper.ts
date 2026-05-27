import type { MarkdownPlugin } from '@nuxt/content';

import { visit } from 'unist-util-visit';

export function remarkMathClassify() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'math') {
        node.data = node.data || {};
        node.data.hProperties = {
          className: 'math-block',
        };
      }

      if (node.type === 'inlineMath') {
        node.data = node.data || {};
        node.data.hProperties = {
          className: 'math-inline',
        };
      }
    });
  };
}

export default {
  instance: remarkMathClassify,
  options: {},
} satisfies MarkdownPlugin;
