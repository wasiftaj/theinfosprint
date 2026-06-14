import PostForm from "@/components/PostForm";

export default function CreatePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            CMS
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Create Post
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Write a draft, add tags, and publish when you’re ready.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <PostForm />
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-cyan-100 bg-cyan-50 p-6 text-cyan-950 shadow-sm">
        <h2 className="text-lg font-bold">Writing tips</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-cyan-900/80">
          <li>• Use a clear title with the main keyword early.</li>
          <li>• Add an excerpt that summarizes the article.</li>
          <li>• Keep tags short and specific.</li>
          <li>• Use the editor for headings, code, and images.</li>
        </ul>
      </aside>
    </div>
  );
}
