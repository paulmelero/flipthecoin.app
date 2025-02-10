import fs from 'fs';
import path from 'path';

const CONTENT_DIR = './content/blog';

export default defineEventHandler(async (event) => {
  const files = fs.readdirSync(CONTENT_DIR);
  const filteredFileNames = files.filter(
    (file) => file.endsWith('.md') && !file.startsWith('.')
  );

  const posts = await Promise.all(
    filteredFileNames.map(async (markdownFileName) => {
      const fileContent = fs.readFileSync(
        path.join(CONTENT_DIR, markdownFileName),
        'utf-8'
      );
      const markdown = await parseMarkdown(fileContent);

      return {
        fileName: markdownFileName.replace('.md', ''),
        title: markdown.data.title,
        excerpt: markdown.excerpt || '',
      };
    })
  );

  return {
    posts,
  };
});
