"use client";

import { useToastStore } from "@/stores/toastStore";
import React from "react";

export type DeleteResult = { success: boolean; error?: string };

interface IDeleteButton {
  postId: string;
  deletePost: (formData: FormData) => Promise<DeleteResult>;
}

export default function DeleteButton(props: IDeleteButton) {
  const { deletePost, postId } = props;
  const addToast = useToastStore((state) => state.addToast);

  const handleDelete = async (formData: FormData) => {
    const result = await deletePost(formData);
    if (result.success) {
      addToast({
        type: "success",
        message: "Post Deleted",
      });
    } else {
      addToast({
        type: "error",
        message: "Failed to delete post, try again",
      });
    }
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" value={postId} name="postId" readOnly />
      <button
        type="submit"
        className="rounded-md border border-neutral-800 bg-transparent px-3 py-1.5 text-[13px] text-neutral-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
      >
        Delete
      </button>
    </form>
  );
}
