import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '@nuxtjs/mdc/runtime';

const CONTENT_DIR = './content';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const markdown = await parseMarkdown(fileContent);

  return {
    body: markdown.body,
    data: markdown.data,
    excerpt: markdown.excerpt,
    toc: markdown.toc,
  };
});
