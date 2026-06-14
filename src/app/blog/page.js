import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { getPreviewImage } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();

  const posts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#f8fafc,#eef2ff_40%,#f8fafc)]">
      <section className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            TheInfoSprint
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Explore the latest articles, guides, and notes from the team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-slate-950">
              No published posts yet.
            </p>
            <p className="mt-2 text-slate-500">
              Published articles will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {posts.map((post) => (
              <article
                key={post._id.toString()}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="space-y-4">
                  {(post.featuredImage || getPreviewImage(post.content)) && (
                    <img
                      src={post.featuredImage || getPreviewImage(post.content)}
                      alt={post.title}
                      className="h-52 w-full rounded-2xl object-cover shadow-sm"
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
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
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
