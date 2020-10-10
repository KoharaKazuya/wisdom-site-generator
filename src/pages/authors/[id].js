import DefaultErrorPage from "next/error";
import Head from "next/head";
import Author from "../../components/Author";
import PostLinks from "../../components/PostLinks";
import { getAllAuthorIds, getAuthorData } from "../../lib/authors";
import { getPostsByAuthor } from "../../lib/posts";
import { deserializeAuthorId, serializeAuthorId } from "../../lib/url";
import site from "../../site.config";

export default function Post({ authorData, authorPosts }) {
  if (!authorData)
    return (
      <>
        <Head>
          <meta name="robots" content="noindex"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  return (
    <>
      <Head>
        <title>
          {authorData.name} - {site.title}
        </title>
      </Head>

      <Author {...authorData} />
      <PostLinks posts={authorPosts} />
    </>
  );
}

export async function getStaticPaths() {
  const authorIds = await getAllAuthorIds();
  const safeAuthorIds = authorIds.map(serializeAuthorId);
  return {
    paths: safeAuthorIds.map((id) => ({ params: { id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const authorId = deserializeAuthorId(params.id);
  const authorData = await getAuthorData(authorId);
  const authorPosts = await getPostsByAuthor(authorId);
  return {
    props: {
      authorData,
      authorPosts,
    },
  };
}
