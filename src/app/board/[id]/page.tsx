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
        <button
          type="submit"
          className="rounded-md border border-neutral-800 bg-transparent px-3 py-1.5 text-[13px] text-neutral-500 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
        >
          Delete
        </button>
      </form>
    );
  };

  return (
    <AnonAuthProvider>
      <div className="mx-auto max-w-200 px-5 py-10">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            {board.title}
          </h1>
          <p className="text-[15px] text-neutral-500">Anonymous board</p>
        </div>

        <div className="mb-12">
          {posts && !posts.length ? (
            <p className="text-neutral-500">No posts yet!</p>
          ) : (
            posts?.map((post) => {
              const userOwnsPost =
                user?.id === post.user_id || user?.id === board.owner_id;

              return (
                <div
                  key={post.id}
                  className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-400">
                      {post.anonymous_name}
                    </span>
                    {userOwnsPost && renderDeleteButton(post.id)}
                  </div>
                  <div className="mb-4 text-[15px] leading-relaxed text-neutral-200">
                    {post.content}
                  </div>
                  <VoteButtons
                    postId={post.id}
                    totalVotes={getVoteTotal(post.id)}
                    currentVote={getUserVote(post.id)}
                  />
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Post Anonymously</h3>
          <form action={createPost}>
            <textarea
              id="newPost"
              name="newPost"
              required
              placeholder="Share your thoughts..."
              className="min-h-30 w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-[15px] text-white transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-2.5 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnonAuthProvider>
  );
}
