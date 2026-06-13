export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">TheInfoSprint</h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block hover:text-gray-300">
            Dashboard
          </a>

          <a href="/dashboard/create" className="block hover:text-gray-300">
            Create Post
          </a>

          <a href="/blog" className="block hover:text-gray-300">
            Blog
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}