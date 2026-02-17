"use client";

import { softDeleteComment } from "@/lib/actions";
import { CommentNode } from "@/lib/buildCommentTree";

interface IActionBarProps {
  onReplyClick: () => void;
  onCollapse: () => void;
  comment: CommentNode;
  isCollapsed: boolean;
  isDeleted: boolean;
  showDelete: boolean;
  boardId: string;
}

export default function ActionBar(props: IActionBarProps) {
  const {
    isCollapsed,
    isDeleted,
    onReplyClick,
    onCollapse,
    comment,
    showDelete,
    boardId,
  } = props;

  return (
    <div className="flex gap-4 items-center">
      {!isDeleted && (
        <button
          type="button"
          onClick={onReplyClick}
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Reply
        </button>
      )}

      {comment.children.length > 0 && (
        <button
          type="button"
          onClick={onCollapse}
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          {isCollapsed
            ? `Show ${comment.children.length} child comments`
            : "Hide child comments"}
        </button>
      )}

      {showDelete && !comment.is_deleted && (
        <button
          type="button"
          onClick={async () => await softDeleteComment(boardId, comment.id)}
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          Delete
        </button>
      )}
    </div>
  );
}
