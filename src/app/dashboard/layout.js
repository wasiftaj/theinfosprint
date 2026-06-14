import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="flex flex-col gap-8 bg-slate-950 p-5 text-white md:min-h-screen md:w-64">
        <div>
          <h2 className="text-xl font-bold">TheInfoSprint</h2>
          <p className="mt-1 text-sm text-slate-400">CMS Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-white/10">
            Dashboard
          </Link>
          <Link
            href="/dashboard/create"
            className="rounded-lg px-3 py-2 hover:bg-white/10"
          >
            Create Post
          </Link>
          <Link href="/blog" className="rounded-lg px-3 py-2 hover:bg-white/10">
            Blog
          </Link>
          <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/10">
            Admin
          </Link>
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
