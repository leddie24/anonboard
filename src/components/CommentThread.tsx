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
    <div>
      <div>{comment.anonymous_name}</div>
      <div>{renderDateTime(comment.created_at!)}</div>
      <div>{comment.is_deleted ? "[deleted]" : comment.content}</div>
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
