"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";

function createSlug(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostForm({ mode = "create", post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "general");
  const [tags, setTags] = useState((post?.tags || []).join(", "));
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [status, setStatus] = useState(post?.status || "published");
  const [content, setContent] = useState(post?.content || {});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const previewSlug = useMemo(() => slug || createSlug(title), [slug, title]);

  const handleTitleChange = (event) => {
    const nextTitle = event.target.value;
    setTitle(nextTitle);

    if (!post && !slug) {
      setSlug(createSlug(nextTitle));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const endpoint = mode === "edit" ? `/api/posts/${post._id}` : "/api/posts";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug: previewSlug,
        excerpt,
        category,
        tags,
        featuredImage,
        status,
        content,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
    setIsSaving(false);

    if (data.success) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="How I Built My First Blog CMS"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Slug</span>
          <input
            value={slug}
            onChange={(event) => setSlug(createSlug(event.target.value))}
            placeholder="how-i-built-my-first-blog-cms"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Tags</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="nextjs, cms, mongodb"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Featured Image URL</span>
          <input
            value={featuredImage}
            onChange={(event) => setFeaturedImage(event.target.value)}
            placeholder="https://..."
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-700">Content</span>
        <Editor data={content} onChange={setContent} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? "Saving..." : mode === "edit" ? "Update Post" : "Save Post"}
        </button>

        {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
