import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Film, 
  AlertOctagon, 
  FolderTree, 
  CheckCircle, 
  FileText, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/listings', label: 'Listings', icon: ShoppingBag },
    { href: '/admin/reels', label: 'Reels Moderation', icon: Film },
    { href: '/admin/reports', label: 'Reports & Flags', icon: AlertOctagon },
    { href: '/admin/categories', label: 'Taxonomy', icon: FolderTree },
    { href: '/admin/verification', label: 'Seller Verification', icon: CheckCircle },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="flex-1 flex flex-col bg-zinc-900 text-zinc-100 min-h-[calc(100vh-8rem)]">
      {/* Admin Notice Strip */}
      <div className="bg-purple-950/80 border-b border-purple-900/60 px-4 py-2 text-xs text-purple-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span className="font-semibold uppercase tracking-wider">Admin Console — Phase 0 Prototype</span>
          <span className="hidden sm:inline text-purple-300">• Unrestricted Access for Structure Verification</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit to Marketplace
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Navigation Sidebar / Horizontal strip on mobile */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/60 p-3 md:p-4 shrink-0">
          <div className="mb-4 hidden md:block">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Operations
            </span>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none text-xs">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0"
                >
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 md:p-8 bg-zinc-900/50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
