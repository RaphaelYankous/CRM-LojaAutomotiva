import { Search, Bell, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-primary/10 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input 
            type="text" 
            placeholder="Search inventory, leads, or VIN..." 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-primary transition-colors relative">
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
        </button>
        <Link href="/settings" className="p-2 text-slate-500 hover:text-primary transition-colors">
          <Settings className="size-5" />
        </Link>
        <div className="h-8 w-[1px] bg-primary/10 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">Alex Rivera</p>
            <p className="text-xs text-slate-500">Sales Manager</p>
          </div>
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 relative">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_ClwxZGfOO_WJeTbAfk2E87jcY28xDiHvRqsKFb_8NpxrA6lswLmXNukozH8LPzQyWkzYX5zI3XZLH-QK3GUwh5_iZNf0Y74gFQ7W23IZWaBM1PkKBykvK2pBbVWv9rKWD9f8mare5q-L_wwhSFhkC1knEbR8M0Yium2O9iRDO7HZpP0yVTtNcL1zqcClVmFylNn48Dfxf-1QLnmMWWUgp1VGct4i1X51sgxw8wVTh4EOtFWzjdEDC1LO4TVfFZRPwjOeBju02Lk" 
              alt="User Profile" 
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
