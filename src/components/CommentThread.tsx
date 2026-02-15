"use client";

import { CommentNode } from "@/lib/buildCommentTree";
import { renderDateTime } from "@/lib/formatDate";

interface ICommentThreadProps {
  comment: CommentNode;
  board_id: string;
  user_id: string | null;
  board_owner_id: string;
  level?: number;
}

export default function CommentThread(props: ICommentThreadProps) {
  const { comment, board_id, user_id, board_owner_id, level = 0 } = props;

  return (
    <div
      className={`mt-3 border-l-2 border-neutral-700/50 pl-4${
        level === 0 ? " pt-3" : ""
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-400">
          {comment.is_deleted ? "[deleted]" : comment.anonymous_name}
        </span>
        <span className="text-xs text-neutral-500">
          {renderDateTime(comment.created_at)}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-300">
        {comment.is_deleted ? (
          <span className="italic text-neutral-500">[deleted]</span>
        ) : (
          comment.content
        )}
      </p>
      {comment.children.map((child) => {
        return (
          <CommentThread
            key={child.id}
            comment={child}
            board_id={board_id}
            user_id={user_id}
            board_owner_id={board_owner_id}
            level={level + 1}
          />
        );
      })}
    </div>
  );
}
