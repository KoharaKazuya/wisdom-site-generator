import Link from "next/link";

/**
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} props.imageUrl
 * @param {string} props.biography
 * @param {string} props.githubUserPageUrl
 */
export default function Author({
  name,
  imageUrl,
  biography,
  githubUserPageUrl,
}) {
  return (
    <div>
      <h1>
        <Link href={githubUserPageUrl}>
          <a target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </Link>
      </h1>
      <p>
        <img src={imageUrl} />
      </p>
      <p>{biography}</p>
    </div>
  );
}
