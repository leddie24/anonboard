import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen items-center justify-center font-san dark:bg-neutral-950">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <h1 className="text-6xl font-bold mb-12">AnonBoard</h1>

        <div className="flex flex-col items-center mb-10">
          <div>Create an anonymous message board.</div>
          <div>Share the link.</div>
          <div>Get honest feedback.</div>
        </div>

        <a
          className="rounded-full px-6 py-3 font-medium
                   bg-neutral-900 text-white hover:bg-neutral-800
                   dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          href={!user ? "/login" : "/create"}
        >
          Create a board
        </a>

        <div className="flex flex-col mt-40">
          <div className="flex items-center gap-4 w-full mb-8">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-neutral-400 text-sm">How it works</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>
          <div className="flex gap-10">
            <div
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-6
                dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div>1. Create a board</div>

              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Next.js logo"
                width={80}
                height={80}
                priority
              />
              <div>Set up an anonymous board.</div>
            </div>
            <div
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-6
                dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div>2. Share the link</div>

              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Next.js logo"
                width={80}
                height={80}
                priority
              />
              <div>Send the link to others.</div>
            </div>
            <div
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-6
                dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div>3. Get anonymous posts & votes</div>

              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Next.js logo"
                width={80}
                height={80}
                priority
              />
              <div>Receive honest feedback.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
