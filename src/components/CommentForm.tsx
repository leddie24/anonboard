"use client";
import { createComment } from "@/lib/actions";
import { useRef } from "react";

interface ICommentFormProps {
  boardId: string;
  postId: string;
  parentId?: string;
}

export default function CommentForm(props: ICommentFormProps) {
  const { boardId, postId, parentId } = props;
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createComment(boardId, formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit}>
      <input type="hidden" value={postId} name="postId" />
      {parentId && <input type="hidden" value={parentId} name="parentId" />}
      <textarea
        name="newComment"
        required
        placeholder="Add a comment..."
        className="min-h-16 w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white transition-colors placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-600"
        >
          Comment
        </button>
      </div>
    </form>
  );
}
