import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAnonymous = user?.is_anonymous ?? false;
  const isLoggedIn = user && !isAnonymous;

  return (
    <nav className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 py-3 backdrop-blur-md">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight transition-colors hover:text-neutral-300"
      >
        AnonBoard
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-neutral-500">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
