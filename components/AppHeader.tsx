"use client";

import Link from "next/link";
import Image from "next/image";

interface AppHeaderProps {
  back?: boolean;
  backHref?: string;
}

export default function AppHeader({ back = false, backHref = "/dashboard" }: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-50">
      {/* Red header band */}
      <header
        style={{
          backgroundColor: "#B22222",
          background: "linear-gradient(135deg, #9b1c1c 0%, #B22222 60%, #c42b2b 100%)",
        }}
      >
        <div
          className="mx-auto flex items-center justify-between px-4"
          style={{ maxWidth: 480, height: 56 }}
        >
          {/* Left */}
          {back ? (
            <Link
              href={backHref}
              className="flex items-center gap-1.5 font-body font-semibold text-sm"
              style={{ color: "rgba(245,245,240,0.9)" }}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Retour
            </Link>
          ) : (
            <div style={{ width: 60 }} />
          )}

          {/* Logo centré — déborde sous le header */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#0D0D0D",
              overflow: "hidden",
              boxShadow:
                "0 0 0 2.5px rgba(255,255,255,0.2), 0 0 0 5px rgba(178,34,34,0.25), 0 8px 24px rgba(0,0,0,0.5)",
              marginTop: 55,
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.jpeg"
              alt="Time To Move"
              width={72}
              height={72}
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div style={{ width: 60 }} />
        </div>
      </header>

      {/* Gradient fade: red → transparent → bg */}
      <div
        aria-hidden
        style={{
          height: 32,
          background:
            "linear-gradient(to bottom, rgba(178,34,34,0.18) 0%, rgba(13,13,13,0) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
