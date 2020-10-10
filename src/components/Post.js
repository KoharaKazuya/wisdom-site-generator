import Link from "next/link";
import { normalizedTag } from "../lib/content";
import { serializeAuthorId } from "../lib/url";
import DateTime from "./DateTime";

export default function Post({ title, date, authors, tags, contentHtml }) {
  return (
    <article>
      <header>
        <h1>{title}</h1>
        <DateTime value={date} />
        <p>Authors</p>
        <ul>
          {authors.map((author) => (
            <li key={`${author.name} <${author.email}>`}>
              {author.email ? (
                <Link href={`/authors/${serializeAuthorId(author.email)}`}>
                  <a>{author.name}</a>
                </Link>
              ) : (
                <span>{author.name}</span>
              )}
            </li>
          ))}
        </ul>
        <p>Tags</p>
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${normalizedTag(tag)}`}>
                <a>{tag}</a>
              </Link>
            </li>
          ))}
        </ul>
      </header>
      <main dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
