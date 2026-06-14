import PostForm from "@/components/PostForm";

export default function CreatePostPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
          CMS
        </p>
        <h1 className="text-3xl font-bold text-slate-950">Create Post</h1>
      </div>

      <PostForm />
    </div>
  );
}
