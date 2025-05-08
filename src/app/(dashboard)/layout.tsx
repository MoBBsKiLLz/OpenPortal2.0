"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import Sidebar from "@/src/app/components/layout/Sidebar";
import Topbar from "@/src/app/components/layout/Topbar";
// import { useTheme } from "@/src/context/ThemeContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const { theme } = useTheme();

  return (
    <SessionProvider>
        <div className={"h-screen flex flex-col"}>
          {/* Topbar (applies its own dark styles internally) */}
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${sidebarOpen ? "w-64" : "w-0"}                
                md:relative md:h-full                         
                fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 
                bg-[#00347B] text-white
              `}
            >
              <Sidebar />
            </aside>

            {/* Main content */}
            <main
              className={`
                flex-1 pt-16 overflow-y-auto transition-all duration-300 ease-in-out
              `}
            >
              {children}
            </main>
          </div>
        </div>
    </SessionProvider>
  );
}
