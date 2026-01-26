"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, Users, Menu, X } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Characters", href: "/admin/characters", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-night-bg text-white overflow-hidden font-sans">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white shadow-lg border border-slate-700"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h1 className="font-serif text-xl text-soft-pink">My Kisah Admin</h1>
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white"
            >
                <X size={20} />
            </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive 
                            ? "bg-soft-pink/10 text-soft-pink border border-soft-pink/20" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-white/5">
            <button 
                onClick={() => logout()}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-night-bg to-[#0f172a] -z-10" />
        <div className="p-4 md:p-8 pt-16 md:pt-8">
            {children}
        </div>
      </main>
    </div>
  );
}
