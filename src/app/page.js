import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
          TheInfoSprint
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight">
          A focused tech blog powered by your own CMS.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Write structured articles, manage drafts, and publish posts from a
          protected dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Read Blog
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
