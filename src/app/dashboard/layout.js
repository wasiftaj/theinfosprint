import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#f8fafc,#eef2ff_30%,#f8fafc)] md:flex">
      <aside className="flex flex-col gap-8 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20 md:min-h-screen md:w-72">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            CMS
          </div>
          <h2 className="mt-4 text-2xl font-black">TheInfoSprint</h2>
          <p className="mt-1 text-sm text-slate-400">CMS Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="rounded-xl px-3 py-3 font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className="rounded-xl px-3 py-3 font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Create Post
          </Link>
          <Link
            href="/blog"
            className="rounded-xl px-3 py-3 font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/admin"
            className="rounded-xl px-3 py-3 font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Admin
          </Link>
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
