"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  // Email/password signup
  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setMessage(error ? error.message : "Signup successful");
  };

  // Email/password signin
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };

  const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    setMessage(error.message);
  }
};


  return (
  <main className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          Sign in to continue to your dashboard
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Sign in */}
      <button
        onClick={signIn}
        className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-900 transition"
      >
        Sign In
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* Google */}
      <button
        onClick={signInWithGoogle}
        className="w-full border py-2 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium text-gray-700">
          Continue with Google
        </span>
      </button>

      {/* Sign up */}
      <p className="text-sm text-center text-gray-500">
        Don’t have an account?{" "}
        <button
          onClick={signUp}
          className="text-black font-medium hover:underline"
        >
          Sign up
        </button>
      </p>

      {/* Message */}
      {message && (
        <p className="text-center text-sm text-red-600">
          {message}
        </p>
      )}
    </div>
  </main>
);

}
