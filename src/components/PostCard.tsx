import { deletePost } from "@/lib/actions";
import { renderDateTime } from "@/lib/formatDate";
import CommentForm from "./CommentForm";
import CommentThread from "./CommentThread";
import DeleteButton from "./DeleteButton";
import VoteButtons from "./VoteButtons";
import { Tables } from "@/lib/database.types";
import { User } from "@supabase/supabase-js";
import { CommentNode } from "@/lib/buildCommentTree";

interface IPostCardProps {
  post: Tables<"posts">;
  user: User | null;
  commentTree: CommentNode[];
  voteTotal: number;
  currentVote: number | null;
  board: Tables<"boards">;
}

export default function PostCard(props: IPostCardProps) {
  const { post, board, user, voteTotal, commentTree, currentVote } = props;

  const userOwnsPost = user?.id === post.user_id || user?.id === board.owner_id;

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
          totalVotes={voteTotal}
          currentVote={currentVote}
        />

        {userOwnsPost && (
          <DeleteButton
            postId={post.id}
            deletePost={deletePost.bind(null, board.id)}
          />
        )}
      </div>
      <div className="mt-4 border-t border-neutral-800 pt-4">
        <CommentForm boardId={board.id} postId={post.id} />
        {commentTree.length > 0 && (
          <div className="mt-3">
            {commentTree.map((commentTreeItem) => (
              <CommentThread
                key={commentTreeItem.id}
                comment={commentTreeItem}
                boardId={board.id}
                userId={user?.id ?? null}
                boardOwnerId={board.owner_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
