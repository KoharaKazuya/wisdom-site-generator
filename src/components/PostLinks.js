import Link from "next/link";
import { Fragment } from "react";
import { serializeAuthorId } from "../lib/url";
import DateTime from "./DateTime";

export default function PostLinks({ posts }) {
  return (
    <ul>
      {posts.map(({ id, title, date, authors }) => (
        <li key={id}>
          <div>
            <Link href={`/posts/${id}`}>
              <a>
                <h2>
                  {title} -{" "}
                  <small>
                    <DateTime value={date} />
                  </small>
                </h2>
              </a>
            </Link>
            <p>
              {authors.map((author, i) => (
                <Fragment key={author}>
                  {i > 0 && ", "}
                  {author.email ? (
                    <Link href={`/authors/${serializeAuthorId(author.email)}`}>
                      <a>{author.name}</a>
                    </Link>
                  ) : (
                    <span>{author.name}</span>
                  )}
                </Fragment>
              ))}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
