"use client";

import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/stores/toastStore";
import React from "react";

export default function VoteButtons({
  postId,
  totalVotes,
  currentVote,
}: {
  postId: string;
  totalVotes: number;
  currentVote: number | null;
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

    const { error } = newVote
      ? await supabase
          .from("votes")
          .upsert(
            { post_id: postId, value: vote },
            { onConflict: "post_id,user_id" },
          )
      : await supabase.from("votes").delete().eq("post_id", postId);
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
          userVote === 1
            ? "border-white/30 bg-white/10 text-white"
            : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-600 hover:bg-neutral-950 hover:text-white"
        }`}
      >
        +1
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-white">
        {voteCount}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={`rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
          userVote === -1
            ? "border-white/30 bg-white/10 text-white"
            : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-600 hover:bg-neutral-950 hover:text-white"
        }`}
      >
        -1
      </button>
    </div>
  );
}
