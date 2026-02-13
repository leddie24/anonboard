"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";

export default function AnonAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    async function getAuth() {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.signInAnonymously();
      }
    }

    getAuth();
  }, []);

  return <>{children}</>;
}
