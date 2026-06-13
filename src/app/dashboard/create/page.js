"use client";

import { useState } from "react";
import Editor from "@/components/Editor";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        excerpt: "",
        category: "general",
        tags: [],
      }),
    });

    const data = await res.json();

    setMessage(data.message);

    if (data.success) {
      setTitle("");
      setSlug("");
      setContent({});
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h1>Create Post (Editor.js)</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <br /><br />

        <Editor data={content} onChange={setContent} />

        <br />

        <button type="submit">Publish</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}