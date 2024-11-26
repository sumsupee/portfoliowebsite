// lib/markdown.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';
import rehypeStringify from 'rehype-stringify';
import { ProjectData } from './types';

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getAllProjects(): Omit<ProjectData, 'content'>[] {
  const fileNames = fs.readdirSync(projectsDirectory);
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const filePath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      id,
      title: data.title,
      image: data.image,
      description: data.description,
      date: data.date,
      tags: data.tags,
      other: data.other,
      duration: data.duration,
    } as Omit<ProjectData, 'content'>;
  });
}

const customSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'iframe', 'CustomIframe','img', 'YouTubeEmbed'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ['src', 'width', 'height', 'frameBorder', 'allow', 'allowFullScreen'],
    '*': ['className','style','class','target'],
    CustomIframe: ['src', 'width', 'height', 'frameBorder', 'allow', 'allowFullScreen','style','class'],
  },
};

export async function getProjectData(id: string): Promise<ProjectData> {
  const filePath = path.join(projectsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // Process raw HTML embedded in markdown
    .use(rehypeSanitize, {
      ...customSanitizeSchema,
      attributes: {
        ...customSanitizeSchema.attributes,
        '*': [
          ...(customSanitizeSchema.attributes['*'] || []),
          'className','style','class', // Allow the 'class' attribute globally
        ],
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    id,
    title: data.title,
    image: data.image,
    description: data.description,
    date: data.date,
    tags: data.tags,
    other: data.other,
    duration: data.duration,
    content: processedContent.toString(),
  };
}
