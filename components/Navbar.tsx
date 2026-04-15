"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      className="glass sticky top-0 z-50"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 group"
          style={{ textDecoration: "none" }}
        >
          <span
            className="font-title text-white text-2xl tracking-widest leading-none"
            style={{ transition: "color 0.2s" }}
          >
            TIME TO MOVE
          </span>
          <span
            className="font-body font-medium mt-1"
            style={{ fontSize: "0.6rem", color: "rgba(178,34,34,0.7)" }}
          >
            ™
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="font-body font-semibold"
              style={{
                fontSize: "0.72rem",
                color: "rgba(245,245,240,0.45)",
                letterSpacing: "0.08em",
                padding: "5px 12px",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 99,
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              ADMIN
            </Link>
          )}

          {/* Avatar */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="avatar-btn w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: "#B22222" }}
            title="Se déconnecter"
          >
            {session?.user?.name?.charAt(0).toUpperCase() ?? "?"}
          </button>
        </div>
      </div>
    </nav>
  );
}
