"use client";

import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/stores/toastStore";
import React from "react";

export default function VoteButtons({
  id,
  totalVotes,
  currentVote,
  tableName,
}: {
  id: string;
  totalVotes: number;
  currentVote: number | null;
  tableName: "votes" | "comment_votes";
}) {
  const [voteCount, setVoteCount] = React.useState(totalVotes);
  const [userVote, setUserVote] = React.useState<number | null>(currentVote);

  const addToast = useToastStore((state) => state.addToast);

  const handleVote = async (vote: 1 | -1) => {
    const supabase = await createClient();

    const newVote = userVote === vote ? null : vote;
    const delta = userVote === vote ? -vote : !userVote ? vote : 2 * vote;

    setUserVote(newVote);
    setVoteCount((prev) => prev + delta);

    let error;

    if (tableName === "votes") {
      const { error: voteError } = newVote
        ? await supabase
            .from(tableName)
            .upsert(
              { post_id: id, value: vote },
              { onConflict: "post_id,user_id" },
            )
        : await supabase.from(tableName).delete().eq("post_id", id);
      error = voteError;
    } else {
      const { error: voteError } = newVote
        ? await supabase
            .from(tableName)
            .upsert(
              { comment_id: id, value: vote },
              { onConflict: "comment_id,user_id" },
            )
        : await supabase.from(tableName).delete().eq("comment_id", id);
      error = voteError;
    }

    if (error) {
      addToast({
        type: "error",
        message: "Vote failed, please try again",
      });
      setUserVote(userVote);
      setVoteCount((prev) => prev - delta);
    }
  };

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-full border border-neutral-500/40 bg-neutral-900/60">
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={`flex items-center px-2.5 text-xs transition-colors ${
          userVote === 1
            ? "text-green-400 bg-green-400/15"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
        }`}
      >
        ▲
      </button>
      <span className="flex items-center justify-center min-w-6 border-x border-neutral-500/40 px-3 text-center text-xs font-semibold text-neutral-200">
        {voteCount}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={`flex items-center px-2.5 text-xs transition-colors ${
          userVote === -1
            ? "text-red-400 bg-red-400/15"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
