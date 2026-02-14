"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-neutral-800 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
    >
      Log out
    </button>
  );
}
