import AnonAuthProvider from "@/components/AnonAuthProvider";
import VoteButtons from "@/components/VoteButtons";
import { generateAnonName } from "@/lib/generateAnonName";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select()
    .eq("id", id)
    .single();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select()
    .eq("board_id", id);

  const postIds = posts?.map((post) => post.id) ?? [];
  const { data: votes } = await supabase
    .from("votes")
    .select()
    .in("post_id", postIds);

  async function createPost(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const anonymousName = generateAnonName(user.id, id);
    const content = formData.get("newPost") as string;
    const { data, error } = await supabase
      .from("posts")
      .insert({ board_id: id, content, anonymous_name: anonymousName })
      .select()
      .single();

    if (error) {
      console.log(error.message);
      return;
    }

    revalidatePath(`/board/${id}`);
  }

  async function deletePost(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const postId = formData.get("postId") as string;
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.log(error.message);
      return;
    }
    revalidatePath(`/board/${id}`);
  }

  const getVoteTotal = (postId: string) => {
    return (
      votes
        ?.filter((v) => v.post_id === postId)
        .reduce((sum, v) => sum + v.value, 0) ?? 0
    );
  };

  const getUserVote = (postId: string) => {
    return (
      votes?.find((v) => v.post_id === postId && v.user_id === user?.id)
        ?.value ?? null
    );
  };

  const renderDeleteButton = (postId: string) => {
    return (
      <form action={deletePost}>
        <input type="hidden" value={postId} name="postId" readOnly />
        <button type="submit">Delete</button>
      </form>
    );
  };

  return (
    <AnonAuthProvider>
      <div>
        <div>
          <h1>{board.title}</h1>
        </div>
        <div>
          {posts && !posts.length
            ? "No posts yet!"
            : posts?.map((post) => {
                const userOwnsPost =
                  user?.id === post.user_id || user?.id === board.owner_id;

                return (
                  <div key={post.id}>
                    <div>{post.content}</div>
                    <div>{post.anonymous_name}</div>
                    {userOwnsPost && renderDeleteButton(post.id)}
                    <VoteButtons
                      postId={post.id}
                      totalVotes={getVoteTotal(post.id)}
                      currentVote={getUserVote(post.id)}
                    />
                  </div>
                );
              })}
        </div>
        <form action={createPost}>
          <label htmlFor="newPost">Post Title:</label>
          <input type="text" id="newPost" name="newPost" required />
          <button type="submit">Create Post</button>
        </form>
      </div>
    </AnonAuthProvider>
  );
}
