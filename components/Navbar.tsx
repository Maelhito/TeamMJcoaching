"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ backgroundColor: "#0d0d0d" }} className="sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="font-title text-white text-2xl tracking-widest leading-none"
          >
            TIME TO MOVE
          </span>
          <span
            className="text-xs text-white/40 font-body font-medium mt-1"
          >
            ™
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-xs font-body font-medium text-white/50 hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Avatar circle */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "#e0292a" }}
            title="Se déconnecter"
          >
            {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
          </button>
        </div>
      </div>
    </nav>
  );
}
