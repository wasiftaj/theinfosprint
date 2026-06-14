"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      {message && <p className="text-sm text-slate-600">{message}</p>}

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
          <p className="font-medium text-slate-950">No posts yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first article to start filling the CMS.
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <article
            key={post._id}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-950">
                    {post.title}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
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
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/dashboard/edit/${post._id}`}
                  className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-800 hover:bg-cyan-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => deletePost(post._id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
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
