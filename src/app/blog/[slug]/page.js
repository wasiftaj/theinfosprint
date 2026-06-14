import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import PostContent from "@/components/PostContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = params;
  await connectDB();

  const post = await Post.findOne({ slug, status: "published" }).lean();

  if (!post) {
    return {
      title: "Post not found | TheInfoSprint",
    };
  }

  return {
    title: `${post.title} | TheInfoSprint`,
    description: post.excerpt || "Read this article on TheInfoSprint.",
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = params;
  await connectDB();

  const post = await Post.findOne({ slug, status: "published" })
    .populate("author", "name email")
    .lean();

  if (!post) {
    notFound();
  }

  await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/blog" className="text-sm font-semibold text-cyan-700">
          Back to blog
        </Link>

        <header className="mt-8 space-y-5 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            <span>{post.category || "general"}</span>
            <span>/</span>
            <span>{post.author?.name || "Unknown author"}</span>
            <span>/</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-slate-950">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl leading-8 text-slate-600">{post.excerpt}</p>
          )}

          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full rounded-lg border border-slate-200 object-cover"
            />
          )}
        </header>

        <div className="pt-8">
          <PostContent content={post.content} />
        </div>
      </article>
    </main>
  );
}
