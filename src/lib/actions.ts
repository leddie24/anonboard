"use server";

// TODO: Add confirmation modal/UX before deleting posts and comments
// TODO: Add deleteBoard action (with confirmation) — board owner only

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateAnonName } from "@/lib/generateAnonName";
import { DeleteResult } from "@/components/DeleteButton";

export async function createPost(
  boardId: string,
  formData: FormData,
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const anonymousName = generateAnonName(user.id, boardId);
  const content = formData.get("newPost") as string;
  const { error } = await supabase
    .from("posts")
    .insert({ board_id: boardId, content, anonymous_name: anonymousName })
    .select()
    .single();

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath(`/board/${boardId}`);
}

export async function deletePost(
  boardId: string,
  formData: FormData,
): Promise<DeleteResult> {
  const supabase = await createClient();
  const postId = formData.get("postId") as string;
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
  revalidatePath(`/board/${boardId}`);
  return { success: true };
}

export async function createComment(
  boardId: string,
  formData: FormData,
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  const anonymousName = generateAnonName(user.id, boardId);

  const content = formData.get("newComment") as string;
  const postId = formData.get("postId") as string;
  const parentId = (formData.get("parentId") as string) ?? null;

  const { error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      parent_id: parentId,
      content,
      anonymous_name: anonymousName,
    })
    .select()
    .single();
  if (error) {
    console.error(error.message);
    return;
  }
  revalidatePath(`/board/${boardId}`);
}

export async function softDeleteComment(
  boardId: string,
  commentId: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true })
    .match({ id: commentId });

  if (error) {
    console.error(error.message);
  }
  revalidatePath(`/board/${boardId}`);
}
