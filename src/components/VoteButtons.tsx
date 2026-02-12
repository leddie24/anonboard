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
    <div>
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={`border border-red-200 p-3 ${userVote === 1 ? `border-red-900` : ""}`}
      >
        +1
      </button>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={`border border-red-200 p-3 ${userVote === -1 ? `border-red-900` : ""}`}
      >
        -1
      </button>
      <div>Votes: {voteCount}</div>
    </div>
  );
}
