"use server";

// TODO: Add confirmation modal/UX before deleting posts and comments
// TODO: Add deleteBoard action (with confirmation) — board owner only

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateAnonName } from "@/lib/generateAnonName";
import { DeleteResult } from "@/components/DeleteButton";
export async function createPost(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const anonymousName = generateAnonName(user.id, id);
  const content = formData.get("newPost") as string;
  const { error } = await supabase
    .from("posts")
    .insert({ board_id: id, content, anonymous_name: anonymousName })
    .select()
    .single();

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath(`/board/${id}`);
}

export async function deletePost(
  id: string,
  formData: FormData,
): Promise<DeleteResult> {
  const supabase = await createClient();
  const postId = formData.get("postId") as string;
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
  revalidatePath(`/board/${id}`);
  return { success: true };
}
