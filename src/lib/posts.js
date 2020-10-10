import {
  asAuthorArray,
  asStringArray,
  entryDate,
  isEntryFileName,
  normalizedTag,
} from "./content";

const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");
const remark = require("remark");
const html = require("remark-html");

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

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const d = matterResult.data;
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
