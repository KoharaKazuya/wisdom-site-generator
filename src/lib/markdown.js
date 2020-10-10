import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

/**
 * @typedef {Object} ParsedMarkdown
 * @property {Object} matter
 * @property {string} contentHtml
 */

/**
 *
 * @param {string} markdown
 * @return {Promise<ParsedMarkdown>}
 */
export async function parseMarkdown(markdown) {
  const { data, content } = matter(markdown);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return { matter: data, contentHtml };
}
