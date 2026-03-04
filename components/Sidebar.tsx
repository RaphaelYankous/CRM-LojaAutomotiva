"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  Wallet, 
  BarChart,
  Calendar,
  ClipboardCheck,
  Settings,
  LogOut
} from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Car },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Contracts', href: '/contracts', icon: FileText },
  { name: 'Finance', href: '/finance', icon: Wallet },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Inspection', href: '/inspection', icon: ClipboardCheck },
  { name: 'Reports', href: '/reports', icon: BarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAppContext();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
          <Car className="size-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-slate-100">AutoCRM</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Portal</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-primary/10">
        <div className="bg-primary/5 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Usage Limit</p>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">750 of 1000 Leads used</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="size-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
