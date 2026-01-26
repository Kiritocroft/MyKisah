"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Photos", href: "/admin/photos", icon: ImageIcon },
    // Add more items here if needed
  ];

  return (
    <div className="flex h-screen bg-night-bg text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
            <h1 className="font-serif text-xl text-soft-pink">My Kisah Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
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
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-night-bg to-[#0f172a] -z-10" />
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
