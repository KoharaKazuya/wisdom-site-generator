import Head from "next/head";
import Comment from "../../components/Comment";
import PostComponent from "../../components/Post";
import { getCommentsByPostId } from "../../lib/comments";
import { getAllPostIds, getPostData } from "../../lib/posts";
import site from "../../site.config";

export default function Post({ post, comments }) {
  return (
    <>
      <Head>
        <title>
          {post.title} - {site.title}
        </title>
      </Head>

      <PostComponent {...post} />
      <hr />
      <div>
        <h2>Comments</h2>
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const postIds = await getAllPostIds();
  return {
    paths: postIds.map((id) => ({ params: { id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const [post, comments] = await Promise.all([
    getPostData(params.id),
    getCommentsByPostId(params.id),
  ]);
  return {
    props: {
      post,
      comments,
    },
  };
}
