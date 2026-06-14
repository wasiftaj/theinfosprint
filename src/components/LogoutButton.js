"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full rounded-lg border border-white/20 px-3 py-2 text-left text-sm font-medium text-white hover:bg-white/10"
    >
      Logout
    </button>
  );
}
