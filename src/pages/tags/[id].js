import Head from "next/head";
import PostLinks from "../../components/PostLinks";
import { getPostsByTag } from "../../lib/posts";
import { getAllNormalizedTags } from "../../lib/tags";
import site from "../../site.config";

export default function Tag({ id, posts }) {
  return (
    <>
      <Head>
        <title>
          {id} - {site.title}
        </title>
      </Head>

      <PostLinks posts={posts} />
    </>
  );
}

export async function getStaticPaths() {
  const tags = await getAllNormalizedTags();
  return {
    paths: tags.map((tag) => ({ params: { id: encodeURIComponent(tag) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const posts = await getPostsByTag(params.id);
  return {
    props: {
      id: params.id,
      posts,
    },
  };
}
