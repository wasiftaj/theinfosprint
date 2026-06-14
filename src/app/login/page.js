"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { signIn } = await import("next-auth/react");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log('signIn response:', res);
    setDebug(JSON.stringify(res));

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_30%),linear-gradient(to_bottom,#020617,#0f172a)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            TheInfoSprint CMS
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Sign in to manage posts, drafts, and publishing.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Use your editor or admin credentials to open the dashboard and start
            creating content.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Access</p>
              <p className="mt-1 text-lg font-semibold">Dashboard</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Flow</p>
              <p className="mt-1 text-lg font-semibold">Login → Create</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Mode</p>
              <p className="mt-1 text-lg font-semibold">Protected CMS</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl shadow-slate-950/40">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your blog
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Login
              </button>
            </form>

            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
            )}

            {debug && (
              <pre className="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                {debug}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
