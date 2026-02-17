import { Tables } from "./database.types";

export interface CommentNode extends Tables<"comments"> {
  children: CommentNode[];
}
export const buildCommentTree = (commentArr: Tables<"comments">[]) => {
  const roots = [];
  const commentMap = new Map<string, CommentNode>();
  for (const comment of commentArr) {
    commentMap.set(comment.id, { ...comment, children: [] });
  }

  for (const comment of commentArr) {
    if (comment.parent_id) {
      const cur = commentMap.get(comment.parent_id);
      if (cur) cur.children.push(commentMap.get(comment.id)!);
    } else {
      roots.push(commentMap.get(comment.id)!);
    }
  }

  return roots;
};

export type CommentVotesMap = Map<string, { total: number; userVote?: number }>;

export const buildCommentVotesMap = (
  commentVotes: Tables<"comment_votes">[],
  userId: string,
) => {
  const voteMap: CommentVotesMap = new Map();

  for (const commentVote of commentVotes) {
    if (voteMap.has(commentVote.comment_id)) {
      const current = voteMap.get(commentVote.comment_id);
      voteMap.set(commentVote.comment_id, {
        total: current!.total + commentVote.value,
        userVote:
          current?.userVote === undefined && userId === commentVote.user_id
            ? commentVote.value
            : current?.userVote,
      });
    } else {
      voteMap.set(commentVote.comment_id, {
        total: commentVote.value,
        userVote:
          userId === commentVote.user_id ? commentVote.value : undefined,
      });
    }
  }

  return voteMap;
};
