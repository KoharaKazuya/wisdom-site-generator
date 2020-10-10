import { useState } from "react";
import { useForm } from "react-hook-form";
import { postComment } from "../lib/wisdom-http-api-client";

/**
 * @param {Object} props
 * @param {string} props.postId
 * @param {((comment: Object) => void)|undefined} props.onSubmit
 */
export default function CommentForm({ postId, onSubmit }) {
  const { register, handleSubmit, reset } = useForm();
  const [formDisabled, setFormDisabled] = useState(false);

  const handler = handleSubmit(async (data) => {
    setFormDisabled(true);
    try {
      const postedComment = await postComment(data);
      reset();
      onSubmit?.(postedComment);
    } finally {
      setFormDisabled(false);
    }
  });

  return (
    <form onSubmit={handler}>
      <div>この記事にコメントする</div>
      <div>
        <input type="hidden" name="postId" value={postId} ref={register} />
        <textarea name="content" ref={register} disabled={formDisabled} />
      </div>
      <div>
        <button disabled={formDisabled}>送信</button>
      </div>
    </form>
  );
}
