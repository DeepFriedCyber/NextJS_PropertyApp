"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen text-dark dark:text-white dark:bg-dark">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900">
        <Link href="/" className="text-xl font-bold text-primary">
          Property Portal
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-dark dark:text-white"
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/properties" className="hover:text-primary">Properties</Link>
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <button
            className="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden flex flex-col items-center bg-white dark:bg-gray-900 py-4 space-y-4">
          <Link href="/properties" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}

      {/* Page Content */}
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
