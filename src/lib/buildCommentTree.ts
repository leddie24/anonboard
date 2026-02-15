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
