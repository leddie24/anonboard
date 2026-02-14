import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: boardsData } = user
    ? await supabase.from("boards").select().eq("owner_id", user.id)
    : {};

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full max-w-3xl flex-col items-center px-8 py-32">
        <h1 className="mb-12 text-6xl font-bold tracking-tight">AnonBoard</h1>

        <div className="mb-10 flex flex-col items-center gap-1 text-neutral-400">
          <span>Create an anonymous message board.</span>
          <span>Share the link.</span>
          <span>Get honest feedback.</span>
        </div>

        <a
          className="rounded-full bg-white px-8 py-3 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
          href={!user ? "/login" : "/create"}
        >
          Create a board
        </a>
        {user && (
          <div className="mt-16 flex w-full flex-col">
            <div className="mb-6 flex w-full items-center gap-4">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-sm text-neutral-500">Your Boards</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            {boardsData?.length ? (
              <div className="flex flex-col gap-3">
                {boardsData.map((board) => (
                  <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800"
                  >
                    <span className="font-medium">{board.title}</span>
                    <span className="text-sm text-neutral-500">&rarr;</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-neutral-500">
                No boards yet. Create your first one!
              </p>
            )}
          </div>
        )}

        <div className="mt-20 flex w-full flex-col">
          <div className="mb-8 flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-sm text-neutral-500">How it works</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="mb-3 text-3xl">1</div>
              <div className="mb-2 font-semibold">Create a board</div>
              <div className="text-sm text-neutral-500">
                Set up an anonymous board in seconds.
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="mb-3 text-3xl">2</div>
              <div className="mb-2 font-semibold">Share the link</div>
              <div className="text-sm text-neutral-500">
                Send the link to anyone you want feedback from.
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
              <div className="mb-3 text-3xl">3</div>
              <div className="mb-2 font-semibold">
                Get anonymous posts &amp; votes
              </div>
              <div className="text-sm text-neutral-500">
                Receive honest, unfiltered feedback.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
