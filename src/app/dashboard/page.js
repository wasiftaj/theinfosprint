import Link from "next/link";
import DashboardPosts from "@/components/DashboardPosts";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-slate-950">Your Posts</h1>
        </div>

        <Link
          href="/dashboard/create"
          className="rounded-lg bg-cyan-600 px-4 py-3 text-center font-semibold text-white hover:bg-cyan-500"
        >
          Create Post
        </Link>
      </div>

      <DashboardPosts />
    </div>
  );
}
