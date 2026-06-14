import EditPostLoader from "@/components/EditPostLoader";

export default async function EditPostPage({ params }) {
  const { id } = params;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
          CMS
        </p>
        <h1 className="text-3xl font-bold text-slate-950">Edit Post</h1>
      </div>

      <EditPostLoader postId={id} />
    </div>
  );
}
