import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { getPreviewImage } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  const posts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.14),transparent_36%),linear-gradient(to_bottom,#f8fafc,#eef2ff_48%,#f8fafc)] text-slate-950">
      <section className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
              <span className="h-2 w-2 rounded-full bg-cyan-500" />
              TheInfoSprint
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              A modern tech blog for readers and a CMS for you.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Browse the latest articles, then log in to manage posts from the
              dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:min-w-[280px]">
            <Link
              href="/blog"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-4 text-center font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
            >
              View Blog
            </Link>
            <Link
              href="/login"
              className="rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
              Fresh content
            </p>
            <h2 className="mt-1 text-2xl font-bold">Latest posts</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-cyan-700">
            See all
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-slate-600">
            No published posts yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id.toString()}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="space-y-4">
                  {(post.featuredImage || getPreviewImage(post.content)) && (
                    <img
                      src={post.featuredImage || getPreviewImage(post.content)}
                      alt={post.title}
                      className="h-48 w-full rounded-2xl object-cover shadow-sm"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {post.category || "general"}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700">
                      {post.author?.name || "Unknown author"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950 transition group-hover:text-cyan-700">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="leading-7 text-slate-600">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-cyan-700 hover:text-cyan-600"
                  >
                    Read article
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
