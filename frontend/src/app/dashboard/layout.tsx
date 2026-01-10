"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setEmail(data.user.email);
      }
    };
    getUser();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <h2 className="text-lg font-semibold">Resume Tool</h2>

        <nav className="space-y-2">
          <button
            onClick={() => router.push("/dashboard/parser")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname.includes("/parser")
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Resume Parser
          </button>

          <button
            onClick={() => router.push("/dashboard/screening")}
            className={`w-full text-left px-4 py-2 rounded ${
              pathname.includes("/screening")
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Resume Screening
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">{email}</span>
          <button
            onClick={logout}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
