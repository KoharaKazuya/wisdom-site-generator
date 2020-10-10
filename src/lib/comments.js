import { asAuthor, entryDate, isEntryFileName } from "./content";
import { parseMarkdown } from "./markdown";

const fs = require("fs").promises;
const path = require("path");

const commentsDirectory = path.join(process.cwd(), "content/comments");

/**
 * @param {string} postId
 */
async function getCommentIdsByPostId(postId) {
  const dir = path.join(commentsDirectory, postId);

  let fileNames;
  try {
    fileNames = await fs.readdir(dir);
  } catch (e) {
    // ディレクトリが存在しない場合はエラーを無視する
    if (typeof e === "object" && e !== null && e.code === "ENOENT") return [];
    // それ以外のエラーは無視しない
    throw e;
  }

  return fileNames
    .filter(isEntryFileName)
    .map((fileName) => `${postId}/${fileName.replace(/\.md$/, "")}`)
    .sort();
}

/**
 * @param {string} id
 */
async function getCommentData(id) {
  const fullPath = path.join(commentsDirectory, `${id}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { matter: d, contentHtml } = await parseMarkdown(fileContents);

  return {
    id,
    date: entryDate(d.date, id),
    author: asAuthor(d.author),
    contentHtml,
  };
}

/**
 * @param {string} postId
 */
export async function getCommentsByPostId(postId) {
  const commentIds = await getCommentIdsByPostId(postId);
  const comments = await Promise.all(commentIds.map(getCommentData));
  return comments;
}
