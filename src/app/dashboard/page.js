import Link from "next/link";
import DashboardPosts from "@/components/DashboardPosts";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              Your Posts
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Create, edit, and publish articles from one place.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Create Post
          </Link>
        </div>
      </div>

      <DashboardPosts />
    </div>
  );
}
