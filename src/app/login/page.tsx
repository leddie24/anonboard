"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import React, { ChangeEvent } from "react";

const Login = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const supabase = createClient();
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  const handleFormUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isButtonsDisabled = !formData.email || !formData.password;

  const handleSignup = async () => {
    const { email, password } = formData;
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setTimeout(() => {
        if (isMounted.current) {
          setError(null);
        }
      }, 10000);
      return;
    }
    router.push("/");
  };

  const handleLogin = async () => {
    const { email, password } = formData;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setTimeout(() => {
        if (isMounted.current) {
          setError(null);
        }
      }, 10000);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-105 rounded-xl border border-neutral-800 bg-neutral-900 p-12">
        <div className="mb-8 text-center text-2xl font-bold tracking-tight">
          AnonBoard
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
          >
            {error}
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-neutral-400"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            onChange={handleFormUpdate}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-[15px] text-white transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-neutral-400"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleFormUpdate}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-[15px] text-white transition-colors focus:border-neutral-600 focus:bg-neutral-900 focus:outline-none"
          />
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            disabled={isButtonsDisabled}
            onClick={handleSignup}
            className="flex-1 rounded-lg border border-neutral-800 bg-transparent px-6 py-3 text-[15px] font-medium text-white transition-colors hover:border-neutral-600 hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign Up
          </button>
          <button
            type="button"
            disabled={isButtonsDisabled}
            onClick={handleLogin}
            className="flex-1 rounded-lg bg-white px-6 py-3 text-[15px] font-medium text-neutral-950 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
