"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const isModules = pathname.startsWith("/dashboard") || pathname.startsWith("/modules");

  const activeColor = "#B22222";
  const inactiveColor = "#3a3a3a";

  return (
    <nav
      className="glass fixed bottom-0 left-0 right-0 z-50"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex" style={{ maxWidth: 480 }}>

        {/* MES PLANS */}
        <Link
          href="/dashboard"
          className="nav-tab flex-1 flex flex-col items-center justify-center gap-1 py-3"
        >
          {/* Active bar */}
          <div
            className="nav-tab-indicator"
            style={{ opacity: isModules ? 1 : 0 }}
          />

          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill="none"
            stroke={isModules ? activeColor : inactiveColor}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: "stroke 0.2s" }}
          >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>

          <span
            className="font-body font-bold"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.07em",
              color: isModules ? activeColor : inactiveColor,
              transition: "color 0.2s",
            }}
          >
            MES PLANS
          </span>
        </Link>

        {/* PROFIL */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-tab flex-1 flex flex-col items-center justify-center gap-1 py-3"
        >
          <div className="nav-tab-indicator" style={{ opacity: 0 }} />

          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke={inactiveColor}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>

          <span
            className="font-body font-bold"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.07em",
              color: inactiveColor,
            }}
          >
            PROFIL
          </span>
        </button>

      </div>
    </nav>
  );
}
