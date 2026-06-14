"use client";

import { useEffect, useState } from "react";
import PostForm from "@/components/PostForm";

export default function EditPostLoader({ postId }) {
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();

      if (data.success) {
        setPost(data.post);
      } else {
        setMessage(data.message);
      }

      setIsLoading(false);
    }

    loadPost();
  }, [postId]);

  if (isLoading) {
    return <p className="text-slate-600">Loading post...</p>;
  }

  if (!post) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
        {message || "Post not found"}
      </div>
    );
  }

  return <PostForm mode="edit" post={post} />;
}
