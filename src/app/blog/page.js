import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  await connectDB();

  const posts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            TheInfoSprint
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Blog</h1>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8">
            <p className="text-lg font-medium text-slate-950">
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
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>{post.category || "general"}</span>
                    <span>/</span>
                    <span>{post.author?.name || "Unknown author"}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && (
                    <p className="leading-7 text-slate-600">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex font-semibold text-cyan-700 hover:text-cyan-600"
                  >
                    Read article
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
