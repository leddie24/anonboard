"use client";

import { CommentNode, CommentVotesMap } from "@/lib/buildCommentTree";
import { renderDateTime } from "@/lib/formatDate";
import CommentForm from "./CommentForm";
import { useState } from "react";
import ActionBar from "./ActionBar";
import VoteButtons from "./VoteButtons";

interface ICommentThreadProps {
  comment: CommentNode;
  boardId: string;
  userId: string | null;
  boardOwnerId: string;
  commentVoteMap: CommentVotesMap;
  level?: number;
}

export default function CommentThread(props: ICommentThreadProps) {
  const {
    comment,
    commentVoteMap,
    boardId,
    userId,
    boardOwnerId,
    level = 0,
  } = props;
  const [collapseThread, setCollapseThread] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const handleReply = () => {
    setShowForm(true);
  };

  const handleCollapse = () => {
    setCollapseThread((prev) => !prev);
  };

  return (
    <div
      className={`mt-3 border-neutral-700/50 ml-4 p-4 rounded-sm  ${level === 0 ? " pt-3" : ""} ${level % 2 === 0 ? "bg-neutral-950" : "bg-neutral-700"}`}
    >
      <div className="ml-0 border-l-2 p-2 pb-2">
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

        <div className="mt-2 flex items-stretch gap-3 min-h-6">
          {!comment.is_deleted && (
            <VoteButtons
              id={comment.id}
              totalVotes={commentVoteMap.get(comment.id)?.total ?? 0}
              currentVote={commentVoteMap.get(comment.id)?.userVote ?? null}
              tableName="comment_votes"
            />
          )}
          <ActionBar
            isDeleted={comment.is_deleted ?? false}
            onReplyClick={handleReply}
            isCollapsed={collapseThread}
            onCollapse={handleCollapse}
            boardId={boardId}
            comment={comment}
            showDelete={userId === comment.user_id || userId === boardOwnerId}
          />
        </div>
      </div>
      {!comment.is_deleted && (
        <CommentForm
          boardId={boardId}
          postId={comment.post_id!}
          parentId={comment.id}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}
      {!collapseThread &&
        comment.children.map((child) => {
          return (
            <CommentThread
              key={child.id}
              commentVoteMap={commentVoteMap}
              comment={child}
              boardId={boardId}
              userId={userId}
              boardOwnerId={boardOwnerId}
              level={level + 1}
            />
          );
        })}
    </div>
  );
}
