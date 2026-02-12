"use client";

import { createClient } from "@/lib/supabase/client";
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

  const handleVote = async (vote: 1 | -1) => {
    const supabase = await createClient();
    // Already voted
    if (userVote === vote) {
      setUserVote(null);
      setVoteCount((prev) => prev - vote);
      await supabase.from("votes").delete().eq("post_id", postId);
    } else {
      // Hasn't voted yet
      if (!userVote) {
        setUserVote(vote);
        setVoteCount((prev) => prev + vote);

        const { error } = await supabase
          .from("votes")
          .insert({ post_id: postId, value: vote });

        if (error) {
          setUserVote(null);
          setVoteCount((prev) => prev - vote);
        }
      } else {
        // Already voted
        setVoteCount((prev) => prev + 2 * vote);
        setUserVote(vote);
        const { error } = await supabase
          .from("votes")
          .upsert(
            { post_id: postId, value: vote },
            { onConflict: "post_id,user_id" },
          );

        if (error) {
          console.log(error.message);
          setVoteCount((prev) => prev - 2 * vote);
          return;
        }
      }
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
