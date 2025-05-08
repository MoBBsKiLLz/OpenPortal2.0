'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [userMgmtOpen, setUserMgmtOpen] = useState(true);

  const isActive = (path: string) =>
    pathname === path ? 'bg-[#FED602] text-[#00347B] font-semibold' : 'text-white';

  return (
    <aside className={`w-64 bg-[#00347B] text-white h-full p-4 space-y-4 overflow-y-auto bg-[var(--sidebar-bg)]`}>
      {/* User Management Group */}
      <div>
        <button
          onClick={() => setUserMgmtOpen(!userMgmtOpen)}
          className={`flex items-center justify-between w-full text-left px-2 py-2 rounded hover:bg-[var(--sidebar-hover-bg)]`}
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            User Management
          </span>
          {userMgmtOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {userMgmtOpen && (
          <div className="ml-6 mt-2 space-y-1">
            {/* <Link href="/users" className={`block px-2 py-1 rounded ${isActive('/dashboard/users')} hover:bg-[var(--sidebar-hover-bg)]`}>
              Users
            </Link> */}
            <Link href="/invites" className={`block px-2 py-1 rounded ${isActive('/dashboard/invites')} hover:bg-[var(--sidebar-hover-bg)]`}>
              Invites
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
