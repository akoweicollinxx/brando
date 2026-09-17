"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0d0d0d]">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden flex items-center gap-3 px-4 h-12 border-b border-gray-100 dark:border-white/8 bg-white dark:bg-[#0d0d0d] sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 -ml-1.5 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Menu</span>
        </div>
        {children}
      </main>
    </div>
  );
}
