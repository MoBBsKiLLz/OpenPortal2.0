"use client";

import { User, Menu, ChevronDown, Sun, Moon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/src/context/ThemeContext";

export default function Topbar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "User";
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between px-6 shadow-md bg-[var(--topbar-bg)] text-[var(--text-color)]`}
    >
      {/* Left: Menu Icon */}
      <div
        onClick={toggleSidebar}
        className={`cursor-pointer flex items-center gap-2 hover:rounded-full px-3 py-3 hover:bg-[var(--menu-hover-bg)]`}
      >
        <button className="focus:outline-none">
          <Menu size={32} />
        </button>
      </div>

      {/* Center: Logo or App Name */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg tracking-wide">
        <div
          className="w-[150px] h-[32px] bg-no-repeat bg-contain"
          style={{ backgroundImage: "var(--logo)" }}
        />
      </div>

      {/* Right: User Dropdown */}
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`relative px-2 md:px-6 py-2 rounded hover:bg-[var(--menu-hover-bg)] bg-[var(--menu-bg)]`}
      >
        <button 
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ChevronDown size={16} />
          <span className="hidden md:inline">{userEmail}</span>
          <span className="md:hidden">
            <User size={20} />
          </span>
        </button>

        {dropdownOpen && (
          <div
            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 origin-top-right transform transition-all duration-600 ease-out animate-fade-in
            bg-[var(--topbar-bg)]`}
          >
            <Link
              href="/settings"
              className={`block px-4 py-2 text-sm hover:bg-[var(--menu-bg)]`}
            >
              Settings
            </Link>
            <a
              href="https://opentechalliance.com/support/"
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-4 py-2 text-sm hover:bg-[var(--menu-bg)]`}
            >
              Help
            </a>
            <div className="block px-4 py-2 text-sm">
              <span className="mb-1 block font-medium">Theme</span>
              <div className="flex items-center justify-between gap-2">
                {/* Sun icon */}
                <span
                  className={`${
                    theme === "light" ? "text-yellow-600" : "text-gray-500"
                  }`}
                >
                  <Sun
                    size={18}
                    className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                  />
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing the dropdown
                    toggleTheme();       // Toggle the theme
                  }} 
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition
                    ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                      ${theme === "dark" ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`${
                    theme === "dark" ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  <Moon
                    size={18}
                    className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                  />
                </span>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: "/login" });
                localStorage.removeItem("theme");
              }}
              className={`block px-4 py-2 text-sm hover:bg-[var(--menu-bg)]`}
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
