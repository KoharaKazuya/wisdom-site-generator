import {
  asAuthorArray,
  asStringArray,
  entryDate,
  isEntryFileName,
  normalizedTag,
} from "./content";
import { parseMarkdown } from "./markdown";

const fs = require("fs").promises;
const path = require("path");

const postsDirectory = path.join(process.cwd(), "content/posts");

export async function getAllPostIds() {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames
    .filter(isEntryFileName)
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .sort()
    .reverse();
}

/**
 * @param {string} id
 */
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { matter: d, contentHtml } = await parseMarkdown(fileContents);

  return {
    id,
    title: String(d.title),
    date: entryDate(d.date, id),
    authors: asAuthorArray(d.authors || d.author),
    tags: asStringArray(d.tags),
    contentHtml,
  };
}

export async function getAllPosts() {
  const ids = await getAllPostIds();
  const posts = await Promise.all(ids.map(getPostData));
  return posts;
}

/**
 * @param {string} authorId
 */
export async function getPostsByAuthor(authorId) {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.authors.map(({ email }) => email).includes(authorId)
  );
}

/**
 * @param {string} tag
 */
export async function getPostsByTag(tag) {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.tags.map(normalizedTag).includes(normalizedTag(tag))
  );
}
