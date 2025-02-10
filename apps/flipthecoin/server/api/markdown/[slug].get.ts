import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '@nuxtjs/mdc/runtime';
import type { MDCParserResult, MDCRoot } from '@nuxtjs/mdc';

const CONTENT_DIR = './content';

const removeExcerptFromBody = (
  body: MDCRoot,
  excerpt: MDCRoot | undefined
): MDCRoot => {
  if (!excerpt) {
    return body;
  }

  const childrenInExcerpt = excerpt.children.length;

  if (childrenInExcerpt === 0) {
    return body;
  }

  return {
    ...body,
    children: body.children.slice(childrenInExcerpt),
  };
};

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const isBlogPost = Boolean(getQuery(event).blog);

  let filePath;
  if (isBlogPost) {
    filePath = path.join(CONTENT_DIR, 'blog', `${slug}.md`);
  } else {
    filePath = path.join(CONTENT_DIR, `${slug}.md`);
  }

  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const markdown = await parseMarkdown(fileContent);

  const response = {
    body: removeExcerptFromBody(markdown.body, markdown.excerpt),
    data: markdown.data,
    excerpt: markdown.excerpt,
    toc: markdown.toc,
  } as Partial<MDCParserResult>;

  return response;
});
