import AnonAuthProvider from "@/components/AnonAuthProvider";
import DeleteButton from "@/components/DeleteButton";
import VoteButtons from "@/components/VoteButtons";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { renderDateTime } from "@/lib/formatDate";
import { createPost, deletePost } from "@/lib/actions";
import { buildCommentTree } from "@/lib/buildCommentTree";
import CommentThread from "@/components/CommentThread";
import CommentForm from "@/components/CommentForm";

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
    .eq("board_id", boardId);

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
    .in("post_id", postIds);

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
              const userOwnsPost =
                user?.id === post.user_id || user?.id === board.owner_id;

              const commentTree = getPostComments(post.id);

              return (
                <div
                  key={post.id}
                  className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-400">
                      {post.anonymous_name}
                    </span>
                    <span className="text-sm font-semibold text-neutral-400">
                      {renderDateTime(post.created_at)}
                    </span>
                  </div>
                  <div className="mb-4 text-[15px] leading-relaxed text-neutral-200">
                    {post.content}
                  </div>
                  <div className="flex justify-between">
                    <VoteButtons
                      postId={post.id}
                      totalVotes={getVoteTotal(post.id)}
                      currentVote={getUserVote(post.id)}
                    />

                    {userOwnsPost && (
                      <DeleteButton
                        postId={post.id}
                        deletePost={deletePost.bind(null, boardId)}
                      />
                    )}
                  </div>
                  <div className="mt-4 border-t border-neutral-800 pt-4">
                    <CommentForm boardId={boardId} postId={post.id} />
                    {commentTree.length > 0 && (
                      <div className="mt-3">
                        {commentTree.map((commentTreeItem) => (
                          <CommentThread
                            key={commentTreeItem.id}
                            comment={commentTreeItem}
                            board_id={board.id}
                            user_id={user?.id ?? null}
                            board_owner_id={board.owner_id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
