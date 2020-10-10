import Head from "next/head";
import PostLinks from "../components/PostLinks";
import { getAllPosts } from "../lib/posts";
import site from "../site.config";

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>{site.title}</title>
      </Head>

      <PostLinks posts={posts} />
    </>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
}
