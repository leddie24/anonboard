import AnonAuthProvider from "@/components/AnonAuthProvider";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { createPost } from "@/lib/actions";
import { buildCommentTree, buildCommentVotesMap } from "@/lib/buildCommentTree";
import PostCard from "@/components/PostCard";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: boardId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select()
    .eq("id", boardId)
    .single();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select()
    .eq("board_id", boardId)
    .order("created_at", { ascending: true });

  if (boardError) {
    notFound();
  }

  const postIds = posts?.map((post) => post.id) ?? [];
  const { data: votes } = await supabase
    .from("votes")
    .select()
    .in("post_id", postIds);

  const { data: comments } = await supabase
    .from("comments")
    .select()
    .in("post_id", postIds)
    .order("created_at", { ascending: true });

  const commentIds = comments?.map((comment) => comment.id) ?? [];

  const { data: commentVotes } = await supabase
    .from("comment_votes")
    .select()
    .in("comment_id", commentIds);

  const getPostComments = (postId: string) => {
    const postComments = comments?.filter((c) => c.post_id === postId) ?? [];
    return buildCommentTree(postComments);
  };

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

  const commentVotesMap = buildCommentVotesMap(
    commentVotes ?? [],
    user?.id ?? "",
  );

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
          {postsError ? (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
            >
              {postsError.message}
            </div>
          ) : !posts.length ? (
            <p className="text-neutral-500">No posts yet!</p>
          ) : (
            posts?.map((post) => {
              const voteTotal = getVoteTotal(post.id);
              const currentVote = getUserVote(post.id);
              const commentTree = getPostComments(post.id);

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  board={board}
                  user={user}
                  commentTree={commentTree}
                  commentVoteMap={commentVotesMap}
                  voteTotal={voteTotal}
                  currentVote={currentVote}
                />
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <h3 className="mb-4 text-lg font-semibold">Post Anonymously</h3>
          <form action={createPost.bind(null, boardId)}>
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
