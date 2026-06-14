"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.filter((post) => post.status === "draft").length;

  const loadPosts = async () => {
    setIsLoading(true);
    const res = await fetch("/api/posts?manage=true");
    const data = await res.json();

    if (data.success) {
      setPosts(data.posts);
    } else {
      setMessage(data.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (postId) => {
    const shouldDelete = window.confirm("Delete this post?");
    if (!shouldDelete) return;

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    const data = await res.json();
    setMessage(data.message);

    if (data.success) {
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    }
  };

  if (isLoading) {
    return <p className="text-slate-600">Loading posts...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total posts</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{posts.length}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">Published</p>
          <p className="mt-2 text-3xl font-black text-emerald-950">{publishedCount}</p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">Drafts</p>
          <p className="mt-2 text-3xl font-black text-amber-950">{draftCount}</p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          {message}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
          <p className="font-semibold text-slate-950">No posts yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first article to start filling the CMS.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <article
            key={post._id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-950">
                    {post.title}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">/{post.slug}</p>
                {post.excerpt && (
                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/dashboard/edit/${post._id}`}
                  className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deletePost(post._id)}
                  className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
