"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, User, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    router.push(`/pages/searchPage?query=${encodedQuery}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/pages/login");
  };

  return (
    <nav className=" top-0 w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-zinc-900 shadow-md relative">
      {/* 🔊 Logo */}
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer text-zinc-900 dark:text-white"
      >
        🎧 Podforge
      </h1>

      {/* 🔍 Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search podcasts..."
          className="w-72 sm:w-96 h-9 px-3 py-1.5 rounded-md border dark:bg-zinc-800 dark:text-white outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-3 py-1.5 rounded-md hover:bg-zinc-800"
        >
          <Search size={18} />
        </button>

        {/* ➕ Post Podcast */}
        <button
          onClick={() => router.push("/pages/postPodcast")}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          <span className="hidden sm:inline text-sm">Post Podcast</span>
        </button>

        {/* 👤 Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <User size={18} />
            <span className="hidden sm:inline text-sm font-medium">Account</span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/pages/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/pages/myPodcasts");
                }}
                className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                My Podcasts
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
