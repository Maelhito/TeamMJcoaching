import Link from "next/link";
import { Module } from "@/lib/modules";

export default function NotionCard({ module, index }: { module: Module; index: number }) {
  return (
    <Link href={`/modules/${module.slug}`} className="block group">
      <div
        style={{
          backgroundColor: "#111111",
          borderRadius: 12,
          border: "1px solid #1a1a1a",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          transition: "border-color 0.15s, background 0.15s",
        }}
        className="group-hover:border-[#B22222] group-active:scale-95"
      >
        {/* Number + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
            className="font-title"
            style={{ fontSize: "1.1rem", color: "#B22222", flexShrink: 0, lineHeight: 1 }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div style={{ minWidth: 0 }}>
            <p
              className="font-body"
              style={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#F5F5F0",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {module.title}
            </p>
            {module.duration && (
              <p className="font-body" style={{ fontSize: "0.72rem", color: "#555", marginTop: 2 }}>
                {module.category} · {module.duration}
              </p>
            )}
          </div>
        </div>

        {/* Arrow */}
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="#B22222" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}
