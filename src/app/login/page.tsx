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
    <div>
      {error && <div role="alert">{error}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          onChange={handleFormUpdate}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleFormUpdate}
        />
      </div>
      <button type="button" disabled={isButtonsDisabled} onClick={handleSignup}>
        Sign Up
      </button>
      <button type="button" disabled={isButtonsDisabled} onClick={handleLogin}>
        Log In
      </button>
    </div>
  );
};

export default Login;
